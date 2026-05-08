import { pool } from "../config/db.js";


export async function selectAllMesas() {
    try {
        const res = await pool.query('SELECT * FROM mesa');

        return res.rows;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function selectMesaById(mesaId) {
    try {
        const res = await pool.query('SELECT * FROM mesa WHERE idmesa = $1', [mesaId]);

        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function insertMesa(titulo, idmestre, linkConvite, sistema = null, descricao = null) {
    
    try {
        const res = await pool.query(
            'INSERT INTO mesa (titulo, mestre_id, link_convite, sistema, descricao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [titulo, idmestre, linkConvite, sistema, descricao]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function deleteMesa(mesaId) {
    try {
        const res = await pool.query('DELETE FROM mesa WHERE idmesa = $1 RETURNING *', [mesaId]);
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function deleteMesaWithParticipantes(mesaId) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query('DELETE FROM participante_mesa WHERE mesa_id = $1', [mesaId]);
        const mesaResult = await client.query('DELETE FROM mesa WHERE idmesa = $1 RETURNING *', [mesaId]);

        await client.query('COMMIT');
        return mesaResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Unexpected database error:", err.message);
        throw err;
    } finally {
        client.release();
    }
}

export async function updateMesa(mesaId, titulo, linkConvite, sistema, descricao) {
    try {
        const res = await pool.query(
            'UPDATE mesa SET titulo = $1, link_convite = $2, sistema = $3, descricao = $4 WHERE idmesa = $5 RETURNING *',
            [titulo, linkConvite, sistema, descricao, mesaId]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function updateMesaCodigoConvite(mesaId, linkConvite) {
    try {
        const res = await pool.query(
            'UPDATE mesa SET link_convite = $1 WHERE idmesa = $2 RETURNING *',
            [linkConvite, mesaId]
        );

        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function verificarConvite(linkConvite) {
    try {
        const res = await pool.query('SELECT idmesa FROM mesa WHERE link_convite = $1', [linkConvite]);
        return res.rows[0]?.idmesa ?? null;
    }
    catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function getMesasByParticipanteId(usuarioId) {
    try {
        const res = await pool.query(
            'SELECT m.* FROM mesa m JOIN participante_mesa p ON m.idmesa = p.mesa_id WHERE p.usuario_id = $1',
            [usuarioId]
        );
        return res.rows;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function transferirMestreMesa(mesaId, mestreAtualId, novoMestreId) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const novoMestreParticipa = await client.query(
            'SELECT 1 FROM participante_mesa WHERE mesa_id = $1 AND usuario_id = $2',
            [mesaId, novoMestreId]
        );

        if (novoMestreParticipa.rowCount === 0) {
            const erro = new Error('New master must already be a participant of this mesa');
            erro.code = 'NEW_MASTER_NOT_PARTICIPANT';
            throw erro;
        }

        const mesaResult = await client.query(
            'UPDATE mesa SET mestre_id = $1 WHERE idmesa = $2 AND mestre_id = $3 RETURNING *',
            [novoMestreId, mesaId, mestreAtualId]
        );

        if (!mesaResult.rows[0]) {
            await client.query('ROLLBACK');
            return null;
        }

        const antigoMestre = await client.query(
            'UPDATE participante_mesa SET tipo_role = $1 WHERE mesa_id = $2 AND usuario_id = $3',
            ['co-mestre', mesaId, mestreAtualId]
        );

        if (antigoMestre.rowCount === 0) {
            await client.query(
                'INSERT INTO participante_mesa (mesa_id, usuario_id, tipo_role) VALUES ($1, $2, $3)',
                [mesaId, mestreAtualId, 'co-mestre']
            );
        }

        await client.query(
            'UPDATE participante_mesa SET tipo_role = $1 WHERE mesa_id = $2 AND usuario_id = $3',
            ['mestre', mesaId, novoMestreId]
        );

        await client.query('COMMIT');
        return mesaResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Unexpected database error:", err.message);
        throw err;
    } finally {
        client.release();
    }
}