import {pool} from '../db.js';


export async function selectPresencasBySessaoId(sessaoId) {
    try {
        const res = await pool.query(
            'SELECT * FROM presenca WHERE sessao_id = $1',
            [sessaoId]
        );
        return res.rows;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function insertPresenca(sessao_id, usuario_id, confirmado=false, comentario=null) {
    try {
        const res = await pool.query(
            'INSERT INTO presenca (sessao_id, usuario_id, confirmado, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
            [sessao_id, usuario_id, confirmado, comentario]
        );
        return res.rows[0];
    }
    catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function updatePresenca(presencaId, confirmado, comentario) {
    try {
        const res = await pool.query(
            'UPDATE presenca SET confirmado = $1, comentario = $2 WHERE idpresenca = $3 RETURNING *',
            [confirmado, comentario, presencaId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}