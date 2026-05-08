import AppError from "../utils/AppError.js";
import * as sessaoRepository from "../repositories/sessaoRepository.js";
import * as participanteRepository from "../repositories/participanteRepository.js";
import { getParticipanteRole } from "./participanteService.js";

function normalizarTexto(valor) {
	if (typeof valor !== "string") {
		return null;
	}

	const texto = valor.trim();
	return texto.length > 0 ? texto : null;
}

function normalizarBooleano(valor) {
	if (typeof valor === "boolean") {
		return valor;
	}

	if (typeof valor === "string") {
		return valor.toLowerCase() === "true";
	}

	return false;
}

function compararDatasMesmaData(dataA, dataB) {
	const formatador = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });
	const chaveA = formatador.format(new Date(dataA));
	const chaveB = formatador.format(new Date(dataB));
	return chaveA === chaveB;
}

async function validarPermissaoSessao(userId, mesaId) {
	const role = await getParticipanteRole(userId, mesaId);

	if (role !== "mestre" && role !== "co-mestre") {
		throw new AppError("Acesso negado: apenas mestre ou co-mestre podem gerenciar sessões.", 403);
	}

	return role;
}

async function calcularStatusPorPresenca(sessaoId, mesaId) {
	const participantes = await participanteRepository.selectParticipantesByMesaId(mesaId);
	const elegiveis = participantes.filter((participante) => participante.tipo_role !== "mestre");
	const presencas = await sessaoRepository.selectPresencasBySessaoId(sessaoId);

	const totalEsperado = elegiveis.length;
	if (totalEsperado === 0) {
		return null;
	}

	const presencasPorUsuario = new Map(
		presencas.map((presenca) => [Number(presenca.usuario_id), presenca])
	);

	let confirmados = 0;
	let recusados = 0;

	for (const participante of elegiveis) {
		const presenca = presencasPorUsuario.get(Number(participante.usuario_id));

		if (!presenca) {
			continue;
		}

		if (presenca.confirmado) {
			confirmados += 1;
		} else {
			recusados += 1;
		}
	}

	const percentualConfirmado = confirmados / totalEsperado;
	const percentualRecusado = recusados / totalEsperado;

	if (percentualConfirmado >= 0.8) {
		return "confirmada";
	}

	if (percentualRecusado >= 0.8) {
		return "cancelada";
	}

	return null;
}

export async function listarSessoesDaMesa(mesaId) {
	return await sessaoRepository.selectSessoesByMesaId(mesaId);
}

export async function obterSessaoPorId(sessaoId, mesaId) {
	const sessao = await sessaoRepository.selectSessaoById(sessaoId);

	if (!sessao) {
		throw new AppError("Sessao not found", 404);
	}

	if (Number(sessao.mesa_id) !== Number(mesaId)) {
		throw new AppError("Sessao not found in this mesa", 404);
	}

	return sessao;
}

export async function criarSessao(mesaId, userId, dados) {
	await validarPermissaoSessao(userId, mesaId);

	if (!dados?.data_hora) {
		throw new AppError("data_hora is required", 400);
	}

	const titulo = normalizarTexto(dados.titulo) ?? "Nova Sessão";
	const descricao = normalizarTexto(dados.descricao);
	const resumoPosJogo = normalizarTexto(dados.resumo_pos_jogo);
	const linkEncontro = normalizarTexto(dados.link_encontro);

	return await sessaoRepository.insertSessao({
		mesaId,
		titulo,
		descricao,
		resumoPosJogo,
		dataHora: dados.data_hora,
		linkEncontro,
		status: normalizarTexto(dados.status) ?? "agendada",
	});
}

export async function atualizarSessao(mesaId, sessaoId, userId, dados) {
	await validarPermissaoSessao(userId, mesaId);

	const sessaoAtual = await obterSessaoPorId(sessaoId, mesaId);
	const titulo = normalizarTexto(dados.titulo) ?? sessaoAtual.titulo;
	const descricao = dados.descricao === undefined ? sessaoAtual.descricao : normalizarTexto(dados.descricao);
	const linkEncontro = dados.link_encontro === undefined ? sessaoAtual.link_encontro : normalizarTexto(dados.link_encontro);
	const dataHora = dados.data_hora ?? sessaoAtual.data_hora;

	if (sessaoAtual.status === "concluida" && dados.data_hora && !compararDatasMesmaData(sessaoAtual.data_hora, dados.data_hora)) {
		throw new AppError("Sessao concluida nao pode ter a data alterada.", 400);
	}

	const sessaoAtualizada = await sessaoRepository.updateSessao(
		sessaoId,
		titulo,
		descricao,
		dataHora,
		linkEncontro
	);

	if (!sessaoAtualizada) {
		throw new AppError("Sessao not found", 404);
	}

	if (dados.data_hora && sessaoAtual.status !== "concluida") {
		const statusResetado = await sessaoRepository.updateSessaoStatus(sessaoId, "agendada");
		return statusResetado;
	}

	return sessaoAtualizada;
}

export async function removerSessao(mesaId, sessaoId, userId) {
	await validarPermissaoSessao(userId, mesaId);

	const sessao = await obterSessaoPorId(sessaoId, mesaId);
	const removida = await sessaoRepository.deleteSessao(sessao.id_sessao);

	if (!removida) {
		throw new AppError("Sessao not found", 404);
	}

	return removida;
}

export async function marcarPresenca(sessaoId, mesaId, userId, dados) {
	const sessao = await obterSessaoPorId(sessaoId, mesaId);
	await getParticipanteRole(userId, mesaId);

	const confirmado = normalizarBooleano(dados.confirmado);
	const comentario = normalizarTexto(dados.comentario);

	const presenca = await sessaoRepository.upsertPresenca(sessao.id_sessao, userId, confirmado, comentario);
	const novoStatus = await calcularStatusPorPresenca(sessao.id_sessao, mesaId);

	if (novoStatus && novoStatus !== sessao.status) {
		await sessaoRepository.updateSessaoStatus(sessao.id_sessao, novoStatus);
	}

	return presenca;
}

export async function listarPresencas(sessaoId, mesaId, userId) {
	await validarPermissaoSessao(userId, mesaId);
	await obterSessaoPorId(sessaoId, mesaId);
	return await sessaoRepository.selectPresencasBySessaoId(sessaoId);
}

export async function concluirSessao(mesaId, sessaoId, userId) {
	await validarPermissaoSessao(userId, mesaId);

	const sessao = await obterSessaoPorId(sessaoId, mesaId);

	if (!compararDatasMesmaData(sessao.data_hora, new Date())) {
		throw new AppError("A sessao so pode ser concluida no dia marcado.", 400);
	}

	if (sessao.status === "cancelada") {
		throw new AppError("Sessao cancelada nao pode ser concluida.", 400);
	}

	if (sessao.status === "concluida") {
		return sessao;
	}

	return await sessaoRepository.updateSessaoStatus(sessaoId, "concluida");
}

export async function atualizarResumoPosJogo(mesaId, sessaoId, userId, resumoPosJogo) {
	await validarPermissaoSessao(userId, mesaId);

	const sessao = await obterSessaoPorId(sessaoId, mesaId);

	if (sessao.status !== "concluida") {
		throw new AppError("Resumo pos-jogo so pode ser atualizado apos a sessao ser concluida.", 400);
	}

	const resumo = normalizarTexto(resumoPosJogo);
	return await sessaoRepository.updateResumoPosJogo(sessaoId, resumo);
}

export async function obterMetricasPresenca(sessaoId, mesaId, userId) {
	await validarPermissaoSessao(userId, mesaId);

	const sessao = await obterSessaoPorId(sessaoId, mesaId);
	const participantes = await participanteRepository.selectParticipantesByMesaId(mesaId);
	const elegiveis = participantes.filter((participante) => participante.tipo_role !== "mestre");
	const presencas = await sessaoRepository.selectPresencasBySessaoId(sessaoId);

	const presencasPorUsuario = new Map(
		presencas.map((presenca) => [Number(presenca.usuario_id), presenca])
	);

	const totais = {
		total_esperado: elegiveis.length,
		confirmados: 0,
		recusados: 0,
		pendentes: 0,
	};

	const detalhes = elegiveis.map((participante) => {
		const presenca = presencasPorUsuario.get(Number(participante.usuario_id));

		if (!presenca) {
			totais.pendentes += 1;
			return {
				usuario_id: participante.usuario_id,
				nickname: participante.nickname,
				confirmado: null,
				comentario: null,
			};
		}

		if (presenca.confirmado) {
			totais.confirmados += 1;
		} else {
			totais.recusados += 1;
		}

		return {
			usuario_id: participante.usuario_id,
			nickname: participante.nickname,
			confirmado: presenca.confirmado,
			comentario: presenca.comentario,
		};
	});

	const percentualConfirmado = totais.total_esperado > 0 ? totais.confirmados / totais.total_esperado : 0;
	const percentualRecusado = totais.total_esperado > 0 ? totais.recusados / totais.total_esperado : 0;

	return {
		sessao,
		totais: {
			...totais,
			percentual_confirmado: percentualConfirmado,
			percentual_recusado: percentualRecusado,
		},
		detalhes,
		status_sugerido: percentualConfirmado >= 0.8 ? "confirmada" : percentualRecusado >= 0.8 ? "cancelada" : sessao.status,
	};
}
