import * as mesaService from '../services/mesaService.js';

export async function criarMesa(req, res) {
    const { titulo, sistema, descricao } = req.body;
    const idmestre = req.user.id; // Pegando o ID do usuário autenticado do token

    if (!titulo) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const novaMesa = await mesaService.criarMesa(titulo, idmestre, sistema, descricao);
        return res.status(201).json(novaMesa);
    } catch (err) {
        console.error("Error creating mesa:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function obterMesas(req, res) {
    try {
        const mesas = await mesaService.obterMesas();
        return res.status(200).json(mesas);
    } catch (err) {
        console.error("Error fetching mesas:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function obterMesaPorId(req, res) {
    const mesaId = req.params.id ?? req.params.mesaId;
    try {
        const mesa = await mesaService.obterMesaPorId(mesaId);
        return res.status(200).json(mesa);
    } catch (err) {
        console.error(`Error fetching mesa with ID ${mesaId}:`, err.message);
        if (err.message === "Mesa not found") {
            return res.status(404).json({ error: "Mesa not found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function excluirMesa(req, res) {
    const mesaId = req.params.id ?? req.params.mesaId;
    try {
        const mesa = await mesaService.excluirMesa(mesaId);
        return res.status(200).json({ message: "Mesa deleted successfully", mesa });
    } catch (err) {
        console.error(`Error deleting mesa with ID ${mesaId}:`, err.message);
        if (err.message === "Mesa not found") {
            return res.status(404).json({ error: "Mesa not found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function atualizarMesa(req, res) {
    const mesaId = req.params.id ?? req.params.mesaId;
    const { titulo, sistema, descricao } = req.body;

    if (!titulo) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const mesa = await mesaService.atualizarMesa(mesaId, titulo, sistema, descricao);
        return res.status(200).json(mesa);
    } catch (err) {
        console.error(`Error updating mesa with ID ${mesaId}:`, err.message);
        if (err.message === "Mesa not found") {
            return res.status(404).json({ error: "Mesa not found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function obterMesasPorIdParticipante(req, res) {
    const usuarioId = req.user.id; // Pegando o ID do usuário autenticado do token

    try {
        const mesas = await mesaService.obterMesasPorIdParticipante(usuarioId);
        return res.status(200).json(mesas);
    } catch (err) {
        console.error(`Error fetching mesas for participant with ID ${usuarioId}:`, err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function transferirMestre(req, res) {
    const mesaId = req.params.id ?? req.params.mesaId;
    const idMestreAtual = req.user.id;
    const { novoMestreId } = req.body;

    if (!novoMestreId) {
        return res.status(400).json({ error: "New master ID is required" });
    }

    try {
        const mesa = await mesaService.transferirMestre(mesaId, idMestreAtual, novoMestreId);
        return res.status(200).json({ message: "Master transferred successfully", mesa });
    } catch (err) {
        console.error(`Error transferring master in mesa with ID ${mesaId}:`, err.message);

        if (err.message === "New master ID is required" || err.message === "New master must be different from current master") {
            return res.status(400).json({ error: err.message });
        }

        if (err.message === "New master must already be a participant of this mesa") {
            return res.status(403).json({ error: err.message });
        }

        if (err.message === "Mesa not found or current user is not the master" || err.message === "New master user not found") {
            return res.status(404).json({ error: err.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function renovarCodigoConvite(req, res) {
    const mesaId = req.params.id ?? req.params.mesaId;

    try {
        const mesa = await mesaService.renovarCodigoConviteMesa(mesaId);
        return res.status(200).json({
            message: "Invitation code regenerated successfully",
            link_convite: mesa.link_convite,
            mesa,
        });
    } catch (err) {
        console.error(`Error regenerating invitation code for mesa with ID ${mesaId}:`, err.message);

        if (err.message === "Mesa not found") {
            return res.status(404).json({ error: err.message });
        }

        if (err.message === "Failed to generate a unique invitation code after multiple attempts") {
            return res.status(500).json({ error: err.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
}