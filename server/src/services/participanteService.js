import * as participanteRepository from '../repositories/participanteRepository.js';
import * as mesaRepository from '../repositories/mesaRepository.js';
import AppError from '../utils/AppError.js';
import {verificarConvite} from './mesaService.js';

export async function obterParticipantesPorMesaId(mesaId) {
    return await participanteRepository.selectParticipantesByMesaId(mesaId);
}

export async function adicionarParticipante(convite, usuarioId, tipo_role='jogador') {
    const mesaId = await verificarConvite(convite);
    if (!mesaId) {
        throw new AppError("Invalid invitation link", 400);
    }
    await participanteRepository.insertParticipante(mesaId, usuarioId, tipo_role);
    // Retornar a mesa completa em vez do participante
    const mesa = await mesaRepository.selectMesaById(mesaId);
    if (!mesa) {
        throw new AppError("Mesa not found", 404);
    }
    return mesa;
}

export async function removerParticipante(usuarioId, mesaId) {

    const role = await getParticipanteRole(usuarioId, mesaId);
    if (role === 'mestre') {
        throw new AppError("Mestre cannot leave the mesa. Consider deleting the mesa or transferring the mestragem to another participant.", 403);
    }

    const participante = await participanteRepository.deleteParticipante(usuarioId, mesaId);
    if (!participante) {
        throw new AppError("Participant not found", 404);
    }
    return participante;
}

export async function atualizarParticipante(usuarioId, mesaId, tipo_role) {
    const rolesPermitidas = ['jogador', 'co-mestre'];

    if (!rolesPermitidas.includes(tipo_role)) {
        throw new AppError("Invalid role type", 400);
    }

    const roleAtual = await getParticipanteRole(usuarioId, mesaId);

    if (roleAtual === 'mestre') {
        throw new AppError("Use master transfer endpoint to change master role", 403);
    }

    const participante = await participanteRepository.updateParticipante(usuarioId, mesaId, tipo_role);
    if (!participante) {
        throw new AppError("Participant not found", 404);
    }
    return participante;
}

export async function getParticipanteRole(userId, mesaId) {
    const roleData = await participanteRepository.getParticipanteRoleByUserIdAndMesaId(userId, mesaId);
    if (!roleData) {
        throw new AppError("Participant not found", 404);
    }
    return roleData.tipo_role;
}