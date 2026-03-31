import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export default function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // Usando seu AppError em vez de res.status direto
        throw new AppError("Token não fornecido", 401);
    }

    const parts = authHeader.split(" ");

    // Uma validação extra simples: verificar se tem "Bearer" e o Token
    if (parts.length !== 2) {
        throw new AppError("Erro no formato do token", 401);
    }

    const [scheme, token] = parts;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Armazenamos como objeto para facilitar expansões futuras
        req.user = {
            id: decoded.id
        };

        return next();
    } catch (err) {
        throw new AppError("Token inválido ou expirado", 401);
    }
}