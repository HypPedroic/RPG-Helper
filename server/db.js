
async function connectToDatabase() {

    if(global.connectionPool) {
        console.log("Using existing database connection pool.");
        return global.connectionPool.connect();
    }

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING,
    });

    const client = await pool.connect();
    
    console.log("Connected to the database successfully.");

    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);

    client.release();

    global.connectionPool = pool;
    return pool.connect();
}


connectToDatabase()

async function selectAllUsers() {
    const client = await connectToDatabase();
    try {
        const res = await client.query('SELECT * FROM users');
        console.log(res.rows);
        return res.rows;
    } finally {
        client.release();
    }
}

async function selectUserById(userId) {
    const client = await connectToDatabase();
    try {
        const res = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
        console.log(res.rows[0]);
        return res.rows[0];
    } finally {
        client.release();
    }
}

async function selectUserByEmail(email) {
    const client = await connectToDatabase();
    try {
        const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log(res.rows[0]);
        return res.rows[0];
    } finally {
        client.release();
    }
}

async function updateUser(id, nome, nickname, email, senha_hash) {
    const client = await connectToDatabase();
    try {
        const res = await client.query(
            'UPDATE users SET nome = $1, nickname = $2, email = $3, senha_hash = $4 WHERE id = $5 RETURNING *',
            [nome, nickname, email, senha_hash, id]
        );
        console.log(res.rows[0]);
        return res.rows[0];
    } finally {
        client.release();
    }
}

async function insertUser(nome, nickname, email, senha_hash) {
    const client = await connectToDatabase();
    try {
        const res = await client.query(
            'INSERT INTO users (nome, nickname, email, senha_hash) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING *',
            [nome, nickname, email, senha_hash]
        );

        if (res.rows.length === 0) {
            throw new Error("User with this email already exists");
        }

        console.log(res.rows[0]);
        return res.rows[0];
    } finally {
        client.release();
    }
}

async function deleteUser(id) {
    const client = await connectToDatabase();
    try {
        const res = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        console.log(res.rows[0]);
        return res.rows[0];
    } finally {
        client.release();
    }
}




module.exports = {
    selectAllUsers,
    selectUserById,
    selectUserByEmail,
    updateUser,
    insertUser,
    deleteUser
};