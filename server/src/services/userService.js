import * as userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

export async function getAllUsers() {
    const users = await userRepository.selectAllUsers();

    if(!users || users.length === 0) {
        return [];
    }

    return users;
}

export async function getUserById(userId) {
    const user = await userRepository.selectUserById(userId);

    if(!user) {
        return null;
    }

    return user;
}

export async function loginUser(email, senha) {
    let user;

    if (!email || !senha) {
        throw new Error("email and senha_hash are required");
    }

    try {
        user = await userRepository.selectUserByEmail(email);
        if (!user) {
            throw new Error("user not found");
        }
    } catch (error) {
        console.error("Error during login:", error);
        throw new Error("Internal Server Error");
    }

    const successfulLogin = await bcrypt.compare(senha, user.senha_hash);
    
    if(successfulLogin) {
        return user;
    } else {
        throw new Error("Invalid credentials");
    }
    
}

export async function registerUser(nome, nickname, email, senha) {
    if (!nome || !nickname || !email || !senha) {
        throw new Error("All fields are required");
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    try {
        const newUser = await userRepository.insertUser(nome, nickname, email, senha_hash);
        if (!newUser) {
            throw new Error("User Already exists");
        }
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.message === "User Already exists") {
            throw error;
        }
        throw new Error("Internal Server Error");
    }

}

export async function updateUser(id, nome, nickname, email, senha) {
    if (!id || !nome || !nickname || !email || !senha) {
        throw new Error("All fields are required");
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    try {
        const updatedUser = await userRepository.updateUser(id, nome, nickname, email, senha_hash);
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Internal Server Error");
    }
}

export async function deleteUser(id) {
    if (!id) {
        throw new Error("User ID is required");
    }

    try {
        const deletedUser = await userRepository.deleteUser(id);
        return deletedUser;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Internal Server Error");
    }
}


