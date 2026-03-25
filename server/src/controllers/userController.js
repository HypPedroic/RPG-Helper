import * as userServices from "../services/userService.js";

export async function listAllUsers(req, res) {
    try {
        const users = await userServices.getAllUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }
        return res.status(200).json(users);
    }catch (err) {
        console.error("Error fetching users:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getUserById(req, res) {
    const userId = req.params.id;
    try {
        const user = await userServices.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error(`Error fetching user with ID ${userId}:`, err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function loginUser(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "email and senha are required" });
    }

    try {
        const user = await userServices.loginUser(email, senha);
        return res.status(200).json(user);
    } catch (err) {
        console.error("Error during login:", err.message);
        if (err.message === "user not found" || err.message === "Invalid credentials") {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createUser(req, res) {
    const { nome, nickname, email, senha } = req.body;

    if (!nome || !nickname || !email || !senha) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newUser = await userServices.registerUser(nome, nickname, email, senha);
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

export async function deleteUser(req, res) {
    const userId = req.params.id;

    try {
        const deletedUser = await userServices.deleteUser(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(deletedUser);
    } catch (err) {
        console.error(`Error deleting user with ID ${userId}:`, err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateUser(req, res) {
    const userId = req.params.id;
    const { nome, nickname, email, senha } = req.body;

    if (!nome || !nickname || !email || !senha) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const updatedUser = await userServices.updateUser(userId, nome, nickname, email, senha);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error(`Error updating user with ID ${userId}:`, err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}