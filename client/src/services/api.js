import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});



export async function registerUser(userData) {
    return api.post("/register", {
        nome: userData.nome,
        nickname: userData.nickname,
        email: userData.email,
        senha: userData.password,
    });
}

export async function loginUser(credentials) {
    return api.post("/login", {
        email: credentials.email,
        senha: credentials.password,
    });
}
