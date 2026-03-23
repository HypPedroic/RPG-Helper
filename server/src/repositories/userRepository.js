import pg from 'pg';

const { Pool } = pg;


async function connectToDatabase() {
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING,
    });

    try {
        const client = await pool.connect();
        console.log("Connected to the database successfully.");
        return client;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    }
}

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
});



export async function selectAllUsers() {
    const client = await connectToDatabase();
    try {
        const res = await client.query('SELECT * FROM users');

        return res.rows;
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    } finally {
        client.release();
    }
}

export async function selectUserById(userId) {
    const client = await connectToDatabase();
    try {
        const res = await client.query('SELECT * FROM users WHERE id = $1', [userId]);

        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    } finally {
        client.release();
    }
}

export async function selectUserByEmail(email) {
    const client = await connectToDatabase();
    try {
        const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;

    } finally {
        client.release();
    }
}

export async function updateUser(id, nome, nickname, email, senha_hash) {
    const client = await connectToDatabase();
    try {
        const res = await client.query(
            'UPDATE users SET nome = $1, nickname = $2, email = $3, senha_hash = $4 WHERE id = $5 RETURNING *',
            [nome, nickname, email, senha_hash, id]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;  
    } finally {
        client.release();
    }
}

export async function insertUser(nome, nickname, email, senha_hash) {
    const client = await connectToDatabase();
    try {
        const res = await client.query(
            'INSERT INTO users (nome, nickname, email, senha_hash) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING *',
            [nome, nickname, email, senha_hash]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    } finally {
        client.release();
    }
}

export async function deleteUser(id) {
    const client = await connectToDatabase();
    try {
        const res = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    } catch (err) {
        console.error("Unexpected database error:", err.message);
        throw err;
    } finally {
        client.release();
    }
}


