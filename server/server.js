require('dotenv').config();

const db = require('./db');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

async function gerarHash(password){
    const hash = await bcrypt.hash(password, 10)
    console.log(password, hash)
    return hash
}

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.get("/users", async (req, res) => {
    try {
        const users = await db.selectAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.selectUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/login", async (req, res) => {
    const { email, senha_hash } = req.body;
    let user;

    if (!email || !senha_hash) {
        return res.status(400).json({ error: "email and senha_hash are required" });
    }

    try {
        user = await db.selectUserByEmail(email);
        if (user) {
            console.log("User found:");
        } else {
            return res.status(401).json({ error: "user not found" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("User from DB:", user);

    const successfulLogin = await bcrypt.compare(senha_hash, user.senha_hash);

    if(successfulLogin) {
        return res.json(user);
    } else {
        return res.status(401).json({ error: "Invalid credentials" });
    }
});

app.post("/register", async (req, res) => {
    const { nome, nickname, email} = req.body;
    const senha_hash = await gerarHash(req.body.senha_hash);

    try {
        const newUser = await db.insertUser(nome, nickname, email, senha_hash);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/*app.get("/test", async (req, res) => {
    let senhaTeste = "senha123";
    let senhaHash = await gerarHash(senhaTeste);
    res.json({
        senha_sem_hash: senhaTeste,
        senha_com_hash: senhaHash,
    })

});
*/

app.listen(port);

console.log(`Server running on port ${port}`);
