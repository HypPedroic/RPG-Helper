import {pool} from '../config/db.js';

export async function selectParticipantesByMesaId(mesaId) {
    try {
        const res = await pool.query(
            'SELECT p.id_participantes, p.tipo_role, p.usuario_id, u.nickname FROM participante_mesa p JOIN mesa m ON p.mesa_id = m.idmesa JOIN users u ON p.usuario_id = u.id WHERE m.idmesa = $1',
            [mesaId]
        );
        return res.rows;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function insertParticipante(mesaId, usuarioId, tipo_role='jogador') {
    try {
        const res = await pool.query(
            'INSERT INTO participante_mesa (mesa_id, usuario_id, tipo_role) VALUES ($1, $2, $3) RETURNING *',
            [mesaId, usuarioId, tipo_role]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function deleteParticipante(usuarioId, mesaId) {
    try {
        const res = await pool.query('DELETE FROM participante_mesa WHERE usuario_id = $1 AND mesa_id = $2 RETURNING *', [usuarioId, mesaId]);
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function updateParticipante(userId, mesaId, tipo_role) {
    try {
        const res = await pool.query(
            'UPDATE participante_mesa SET tipo_role = $1 WHERE usuario_id = $2 AND mesa_id = $3 RETURNING *',
            [tipo_role, userId, mesaId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function getParticipanteRoleByUserIdAndMesaId(userId, mesaId) {
    try {
        const res = await pool.query(
            'SELECT tipo_role FROM participante_mesa WHERE usuario_id = $1 AND mesa_id = $2',
            [userId, mesaId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function updateDataAcessoParticipante(userId, mesaId) {
    try {
        const res = await pool.query(
            'UPDATE participante_mesa SET ultima_presenca = NOW() WHERE usuario_id = $1 AND mesa_id = $2 RETURNING *',
            [userId, mesaId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}