import * as participanteService from '../services/participanteService.js';

export async function obterParticipantesPorMesaId(req, res) {
    const mesaId = req.params.id ?? req.params.mesaId;
    try {
        const participantes = await participanteService.obterParticipantesPorMesaId(mesaId);
        return res.status(200).json(participantes);
    } catch (err) {
        console.error(`Error fetching participants for mesa ID ${mesaId}:`, err.message);
        if (err.message === "Mesa not found") {
            return res.status(404).json({ error: "Mesa not found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function adicionarParticipante(req, res) {
    const id_usuario = req.user.id;
    const {convite} = req.body;

    if (!convite) {
        return res.status(400).json({ error: "Invitation code is required" });
    }

    try {
        const participante = await participanteService.adicionarParticipante(convite, id_usuario);
        return res.status(201).json(participante);
    } catch (err) {
        console.error("Error adding participant:", err.message);
        if (err.message === "Invalid invitation code") {
            return res.status(400).json({ error: err.message });
        }
        if (err.message === "User is already a participant in this mesa") {
            return res.status(409).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function sairDaMesa(req, res) {
    const id_usuario = req.user.id;
    const {mesaId} = req.params;

    try {
        const participante = await participanteService.removerParticipante(id_usuario, mesaId);
        return res.status(200).json(participante);
    } catch (err) {
        console.error(`Error leaving mesa with user ID ${id_usuario} and mesa ID ${mesaId}:`, err.message);
        if (err.message === "Participant not found") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function removerParticipante(req, res) {
    const id_usuario = req.params.usuarioId ?? req.body.usuarioId ?? req.body.id_usuario ?? req.body.id;
    const {mesaId} = req.params;

    if (!id_usuario) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const participante = await participanteService.removerParticipante(id_usuario, mesaId);
        return res.status(200).json(participante);
    } catch (err) {
        console.error(`Error removing participant with user ID ${id_usuario} from mesa ID ${mesaId}:`, err.message);
        if (err.message === "Participant not found") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function atualizarParticipante(req, res) {
    const {mesaId, usuarioId} = req.params;
    const {tipo_role} = req.body;

    if (!tipo_role) {
        return res.status(400).json({ error: "Role type is required" });
    }

    try {
        const participante = await participanteService.atualizarParticipante(usuarioId, mesaId, tipo_role);
        return res.status(200).json(participante);
    } catch (err) {
        console.error(`Error updating participant with user ID ${usuarioId} in mesa ID ${mesaId}:`, err.message);

        if (err.message === "Invalid role type") {
            return res.status(400).json({ error: err.message });
        }

        if (err.message === "Use master transfer endpoint to change master role") {
            return res.status(403).json({ error: err.message });
        }

        if (err.message === "Participant not found") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function obterRoleParticipante(req, res) {
    const id_usuario = req.user.id;
    const { mesaId } = req.params;

    try {
        const role = await participanteService.getParticipanteRole(id_usuario, mesaId);
        return res.status(200).json({ role });
    } catch (err) {
        console.error(`Error fetching role for user ID ${id_usuario} in mesa ID ${mesaId}:`, err.message);
        if (err.message === "Participant not found") {
            return res.status(404).json({ error: "User is not a participant in this mesa" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}