import * as sessaoService from "../services/sessaoService.js";

function tratarErro(res, err) {
    if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    return null;
}

export async function listarSessoes(req, res) {
    const mesaId = req.params.mesaId;

    try {
        const sessoes = await sessaoService.listarSessoesDaMesa(mesaId);
        return res.status(200).json(sessoes);
    } catch (err) {
        console.error(`Error fetching sessions for mesa ID ${mesaId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function obterSessao(req, res) {
    const { mesaId, sessaoId } = req.params;

    try {
        const sessao = await sessaoService.obterSessaoPorId(sessaoId, mesaId);
        return res.status(200).json(sessao);
    } catch (err) {
        console.error(`Error fetching session ${sessaoId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function criarSessao(req, res) {
    const { mesaId } = req.params;

    try {
        const sessao = await sessaoService.criarSessao(mesaId, req.user.id, req.body);
        return res.status(201).json(sessao);
    } catch (err) {
        console.error(`Error creating session for mesa ID ${mesaId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function atualizarSessao(req, res) {
    const { mesaId, sessaoId } = req.params;

    try {
        const sessao = await sessaoService.atualizarSessao(mesaId, sessaoId, req.user.id, req.body);
        return res.status(200).json(sessao);
    } catch (err) {
        console.error(`Error updating session ${sessaoId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function removerSessao(req, res) {
    const { mesaId, sessaoId } = req.params;

    try {
        const sessao = await sessaoService.removerSessao(mesaId, sessaoId, req.user.id);
        return res.status(200).json({ message: "Sessao deleted successfully", sessao });
    } catch (err) {
        console.error(`Error deleting session ${sessaoId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function marcarPresenca(req, res) {
    const { mesaId, sessaoId } = req.params;

    try {
        const presenca = await sessaoService.marcarPresenca(sessaoId, mesaId, req.user.id, req.body);
        return res.status(200).json(presenca);
    } catch (err) {
        console.error(`Error updating attendance for session ${sessaoId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function listarPresencas(req, res) {
    const { mesaId, sessaoId } = req.params;

    try {
        const presencas = await sessaoService.listarPresencas(sessaoId, mesaId, req.user.id);
        return res.status(200).json(presencas);
    } catch (err) {
        console.error(`Error fetching attendance for session ${sessaoId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function concluirSessao(req, res) {
    const { mesaId, sessaoId } = req.params;

    try {
        const sessao = await sessaoService.concluirSessao(mesaId, sessaoId, req.user.id);
        return res.status(200).json(sessao);
    } catch (err) {
        console.error(`Error concluding session ${sessaoId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function atualizarResumoPosJogo(req, res) {
    const { mesaId, sessaoId } = req.params;
    const { resumo_pos_jogo } = req.body;

    try {
        const sessao = await sessaoService.atualizarResumoPosJogo(mesaId, sessaoId, req.user.id, resumo_pos_jogo);
        return res.status(200).json(sessao);
    } catch (err) {
        console.error(`Error updating post-game summary for session ${sessaoId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function obterMetricasPresenca(req, res) {
    const { mesaId, sessaoId } = req.params;

    try {
        const metricas = await sessaoService.obterMetricasPresenca(sessaoId, mesaId, req.user.id);
        return res.status(200).json(metricas);
    } catch (err) {
        console.error(`Error fetching attendance metrics for session ${sessaoId}:`, err.message);
        const resposta = tratarErro(res, err);
        if (resposta) {
            return resposta;
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}