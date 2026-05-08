// client/src/services/mesaAPI.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});

// Interceptor para adicionar o token em cada requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("@RPG:token"); // O token salvo no login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Criar uma mesa
export async function criarMesa(titulo) {
    return api.post("/mesas", { titulo });
}

// Listar mesas do usuário
export async function obterMinhasMesas() {
    return api.get("/users/me/mesas");
}

// Obter detalhes de uma mesa específica
export async function obterMesaPorId(mesaId) {
    return api.get(`/mesas/${mesaId}`);
}

// Obter participantes de uma mesa
export async function obterParticipantesDaMesa(mesaId) {
    return api.get(`/mesas/${mesaId}/participantes`);
}

// Obter apenas o role do usuário autenticado em uma mesa
export async function obterRoleMesa(mesaId) {
    return api.get(`/mesas/${mesaId}/participantes/role/me`);
}

export async function entrarMesaComConvite(codigoConvite) {
    return api.post("/mesas/join", { convite: codigoConvite });
}

// Atualizar informações da mesa (apenas mestre)
export async function atualizarMesa(mesaId, dados) {
    return api.put(`/mesas/${mesaId}`, dados);
}

// Deletar mesa (apenas mestre)
export async function deletarMesa(mesaId) {
    return api.delete(`/mesas/${mesaId}`);
}

// Regenerar código de convite (apenas mestre)
export async function regenerarCodigoConvite(mesaId) {
    return api.patch(`/mesas/${mesaId}/invite-code`);
}

// Transferir mestragem (apenas mestre)
export async function transferirMestragem(mesaId, novoMestreId) {
    return api.patch(`/mesas/${mesaId}/master`, { novoMestreId });
}

// Alterar role de participante (apenas mestre/co-mestre)
export async function alterarRoleParticipante(mesaId, usuarioId, tipo_role) {
    return api.patch(`/mesas/${mesaId}/participantes/${usuarioId}/role`, { tipo_role });
}

// Remover participante da mesa (apenas mestre/co-mestre)
export async function removerParticipante(mesaId, usuarioId) {
    return api.delete(`/mesas/${mesaId}/participantes/${usuarioId}`);
}

// Sair da mesa
export async function sairDaMesa(mesaId) {
    return api.delete(`/mesas/${mesaId}/participantes/me`);
}