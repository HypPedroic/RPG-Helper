import { getParticipanteRole } from "../services/participanteService.js";
import { updateDataAcessoParticipante } from "../repositories/participanteRepository.js";

export async function ensureTable(req, res, next) {
    const mesaId = req.params.mesaId ?? req.params.id;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!mesaId) {
        return res.status(400).json({ error: "ID da mesa não informado" });
    }

    try {
        const tipoRole = await getParticipanteRole(userId, mesaId);

        if (!tipoRole) {
            return res.status(403).json({ error: "Acesso negado: você não é participante desta mesa." });
        }

        req.user.role = tipoRole;

        // Atualiza a data de acesso do participante
        await updateDataAcessoParticipante(userId, mesaId);

        return next();
    } catch (err) {
        console.error("Error in ensureTable middleware:", err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}