import { pool } from "../config/db.js";

export async function selectSessoesByMesaId(mesaId) {
    try {
        const res = await pool.query(
            "SELECT * FROM sessoes WHERE mesa_id = $1 ORDER BY data_hora ASC, id_sessao ASC",
            [mesaId]
        );
        return res.rows;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function selectSessaoById(sessaoId) {
    try {
        const res = await pool.query(
            "SELECT * FROM sessoes WHERE id_sessao = $1",
            [sessaoId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function insertSessao({ mesaId, titulo, descricao = null, resumoPosJogo = null, dataHora, linkEncontro = null, status = "agendada" }) {
    try {
        const res = await pool.query(
            "INSERT INTO sessoes (mesa_id, titulo, descricao, resumo_pos_jogo, data_hora, link_encontro, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [mesaId, titulo, descricao, resumoPosJogo, dataHora, linkEncontro, status]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function updateSessao(sessaoId, titulo, descricao, dataHora, linkEncontro) {
    try {
        const res = await pool.query(
            "UPDATE sessoes SET titulo = $1, descricao = $2, data_hora = $3, link_encontro = $4 WHERE id_sessao = $5 RETURNING *",
            [titulo, descricao, dataHora, linkEncontro, sessaoId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function updateSessaoStatus(sessaoId, status) {
    try {
        const res = await pool.query(
            "UPDATE sessoes SET status = $1 WHERE id_sessao = $2 RETURNING *",
            [status, sessaoId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function updateResumoPosJogo(sessaoId, resumoPosJogo) {
    try {
        const res = await pool.query(
            "UPDATE sessoes SET resumo_pos_jogo = $1 WHERE id_sessao = $2 RETURNING *",
            [resumoPosJogo, sessaoId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function deleteSessao(sessaoId) {
    try {
        const res = await pool.query(
            "DELETE FROM sessoes WHERE id_sessao = $1 RETURNING *",
            [sessaoId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function selectPresencasBySessaoId(sessaoId) {
    try {
        const res = await pool.query(
            `SELECT sp.id_presenca, sp.sessao_id, sp.usuario_id, sp.confirmado, sp.comentario, u.nickname
             FROM sessao_presenca sp
             JOIN users u ON u.id = sp.usuario_id
             WHERE sp.sessao_id = $1
             ORDER BY u.nickname ASC`,
            [sessaoId]
        );
        return res.rows;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function upsertPresenca(sessaoId, usuarioId, confirmado = false, comentario = null) {
    try {
        const res = await pool.query(
            `INSERT INTO sessao_presenca (sessao_id, usuario_id, confirmado, comentario)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (sessao_id, usuario_id)
             DO UPDATE SET confirmado = EXCLUDED.confirmado,
                           comentario = EXCLUDED.comentario
             RETURNING *`,
            [sessaoId, usuarioId, confirmado, comentario]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}