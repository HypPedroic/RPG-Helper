import { pool } from "../config/db.js";



export async function selectAllUsers() {
    try {
        const res = await pool.query('SELECT * FROM users');

        return res.rows;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function selectUserById(userId) {
    try {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function selectUserByEmail(email) {
    try {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function updateUser(id, nome, nickname, email, senha_hash) {
    try {
        const res = await pool.query(
            'UPDATE users SET nome = $1, nickname = $2, email = $3, senha_hash = $4 WHERE id = $5 RETURNING *',
            [nome, nickname, email, senha_hash, id]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function insertUser(nome, nickname, email, senha_hash) {
    try {
        const res = await pool.query(
            'INSERT INTO users (nome, nickname, email, senha_hash) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING *',
            [nome, nickname, email, senha_hash]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

export async function deleteUser(id) {
    try {
        const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}


