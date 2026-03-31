import * as userRepository from "../repositories/userRepository.js";
import AppError from "../utils/AppError.js";
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

export async function getUserByEmail(email) {
    
    if (!email) {
        return null;
    }

    return await userRepository.selectUserByEmail(email);
    
}

export async function CreateUser(nome, nickname, email, senha_hash) {
    
    const {emailExists, nicknameExists} = await userRepository.selectUserByEmail(email, nickname);
    if (emailExists) {
        throw new AppError("Email already exists", 409);
    }
    if (nicknameExists) {
        throw new AppError("Nickname already exists", 409);
    }

    return await userRepository.insertUser(nome, nickname, email, senha_hash);

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


