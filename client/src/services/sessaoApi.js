import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("@RPG:token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export async function listarSessoesDaMesa(mesaId) {
    return api.get(`/mesas/${mesaId}/sessoes`);
}

export async function criarSessao(mesaId, dados) {
    return api.post(`/mesas/${mesaId}/sessoes`, dados);
}

export async function atualizarSessao(mesaId, sessaoId, dados) {
    return api.patch(`/mesas/${mesaId}/sessoes/${sessaoId}`, dados);
}

export async function concluirSessao(mesaId, sessaoId) {
    return api.patch(`/mesas/${mesaId}/sessoes/${sessaoId}/concluir`);
}

export async function removerSessao(mesaId, sessaoId) {
    return api.delete(`/mesas/${mesaId}/sessoes/${sessaoId}`);
}

export async function marcarPresenca(mesaId, sessaoId, dados) {
    return api.patch(`/mesas/${mesaId}/sessoes/${sessaoId}/presenca/me`, dados);
}

export async function atualizarResumoPosJogo(mesaId, sessaoId, resumo_pos_jogo) {
    return api.patch(`/mesas/${mesaId}/sessoes/${sessaoId}/resumo`, { resumo_pos_jogo });
}

export async function listarPresencasDaSessao(mesaId, sessaoId) {
    return api.get(`/mesas/${mesaId}/sessoes/${sessaoId}/presencas`);
}

export async function obterMetricasPresenca(mesaId, sessaoId) {
    return api.get(`/mesas/${mesaId}/sessoes/${sessaoId}/metricas`);
}