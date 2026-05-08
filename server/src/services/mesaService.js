import * as mesaRepository from "../repositories/mesaRepository.js";
import AppError from "../utils/AppError.js";
import crypto from "crypto";

export function gerarConvite(tamanho = 10) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let resultado = "";

    const aleatorios = crypto.randomBytes(tamanho);

    for (let i = 0; i < tamanho; i++) {
        resultado += caracteres[aleatorios[i] % caracteres.length];
    }

    return resultado;
}

export async function criarMesa(titulo, idmestre, sistema = null, descricao = null) {

    if (!titulo || !idmestre) {
        throw new AppError("Title and Master ID are required", 400);
    }

    let criado = false;
    let tentativa = 0;

    while(!criado && tentativa < 5) {
        try{
            const codigo = gerarConvite();
            const novaMesa = await mesaRepository.insertMesa(titulo, idmestre, codigo, sistema, descricao);
            criado = true;
            return novaMesa;
        }
        catch (err) {
            if (err.code === "23505") { // Código de erro para violação de chave única no PostgreSQL
                console.warn(`Código de convite duplicado gerado: ${err.detail}. Tentando novamente...`);
                tentativa++;
            } else {
                console.error("Erro inesperado ao criar mesa:", err.message);
                throw err;
            }
        }
    }

    throw new AppError("Failed to generate a unique invitation code after multiple attempts", 500);
}

export async function obterMesas() {
    return await mesaRepository.selectAllMesas();
}

export async function obterMesaPorId(mesaId) {
    const mesa = await mesaRepository.selectMesaById(mesaId);
    if (!mesa) {
        throw new AppError("Mesa not found", 404);
    }
    return mesa;
}

export async function excluirMesa(mesaId) {
    const mesa = await mesaRepository.deleteMesaWithParticipantes(mesaId);
    if (!mesa) {
        throw new AppError("Mesa not found", 404);
    }
    return mesa;
}

export async function atualizarMesa(mesaId, titulo, sistema, descricao) {
    const mesaAtual = await mesaRepository.selectMesaById(mesaId);
    if (!mesaAtual) {
        throw new AppError("Mesa not found", 404);
    }

    // Manter o linkConvite atual se não for fornecido
    const mesa = await mesaRepository.updateMesa(
        mesaId,
        titulo,
        mesaAtual.link_convite,
        sistema,
        descricao
    );

    if (!mesa) {
        throw new AppError("Mesa not found", 404);
    }
    return mesa;
}

export async function verificarConvite(linkConvite) {
    const idmesa = await mesaRepository.verificarConvite(linkConvite);
    const mesaId = Number.parseInt(idmesa, 10);

    if (!Number.isInteger(mesaId) || mesaId <= 0) {
        throw new AppError("Invalid invitation link", 404);
    }

    return mesaId;
}

export async function obterMesasPorIdParticipante(usuarioId) {
    return await mesaRepository.getMesasByParticipanteId(usuarioId);
}

export async function transferirMestre(mesaId, mestreAtualId, novoMestreId) {
    if (!novoMestreId) {
        throw new AppError("New master ID is required", 400);
    }

    if (Number(novoMestreId) === Number(mestreAtualId)) {
        throw new AppError("New master must be different from current master", 400);
    }

    try {
        const mesaAtualizada = await mesaRepository.transferirMestreMesa(mesaId, mestreAtualId, novoMestreId);

        if (!mesaAtualizada) {
            throw new AppError("Mesa not found or current user is not the master", 404);
        }

        return mesaAtualizada;
    } catch (err) {
        if (err.code === "NEW_MASTER_NOT_PARTICIPANT") {
            throw new AppError("New master must already be a participant of this mesa", 403);
        }

        if (err.code === "23503") {
            throw new AppError("New master user not found", 404);
        }

        throw err;
    }
}

export async function renovarCodigoConviteMesa(mesaId) {
    let atualizado = false;
    let tentativa = 0;

    while (!atualizado && tentativa < 5) {
        try {
            const novoCodigo = gerarConvite();
            const mesa = await mesaRepository.updateMesaCodigoConvite(mesaId, novoCodigo);

            if (!mesa) {
                throw new AppError("Mesa not found", 404);
            }

            atualizado = true;
            return mesa;
        } catch (err) {
            if (err.code === "23505") {
                tentativa++;
                continue;
            }

            throw err;
        }
    }

    throw new AppError("Failed to generate a unique invitation code after multiple attempts", 500);
}