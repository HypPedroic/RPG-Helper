import * as authServices from "../services/authService.js";
import * as userServices from "../services/userService.js";


export async function loginUser(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "email and senha are required" });
    }

    try {
        const user = await authServices.login(email, senha);
        return res.status(200).json(user);
    } catch (err) {
        console.error("Error during login:", err.message);
        if (err.message === "Invalid email or password") {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function registerUser(req, res) {
    const { nome, nickname, email, senha } = req.body;

    if (!nome || !nickname || !email || !senha) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newUser = await authServices.register(nome, nickname, email, senha);
        return res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (err) {
        if (err.message === "User Already exists") {
            return res.status(409).json({ error: err.message });
        }
        console.error("Error creating user:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function checkEmailExists(req, res) {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const user = await userServices.getUserByEmail(email);
        return res.status(200).json({ exists: !!user });
    } catch (err) {
        console.error("Error checking email:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function checkNicknameExists(req, res) {
    const { nickname } = req.params;

    if (!nickname) {
        return res.status(400).json({ error: "Nickname is required" });
    }

    try {
        const user = await userServices.getUserByNickname(nickname);
        return res.status(200).json({ exists: !!user });
    } catch (err) {
        console.error("Error checking nickname:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
