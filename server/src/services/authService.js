import jwt from "jsonwebtoken";
import * as userRepository from "./userService.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

export async function login(email, senha) {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return {token, user: {nome: user.nome, nickname: user.nickname}};

}

export async function register(nome, nickname, email, senha) {
    
    
    senha_hash = await bcrypt.hash(senha, 10);

    const newUser = await userRepository.insertUser(nome, nickname, email, senha_hash);

    return newUser;
}