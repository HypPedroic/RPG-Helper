
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "./input";
import { ButtomConfirm } from "./buttonConfirm";
import api from "../services/api";

async function loginUser(userData) {
    const user = await api.post("/login", {
        email: userData.email,
        senha_hash: userData.password
    });
    return user;
}



export function FormsLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const isFormValid = email.trim() !== "" && password.trim() !== "";

    async function handleLogin(userData) {
        try {
            const response = await loginUser({ email: userData.email, password: userData.password });
            console.log("Login successful:", response.data);
            navigate("/teste", { state: { user: response.data } });
        } catch (error) {
            console.error("Login failed:", error);
            alert("Falha no login. Verifique e-mail e senha.");
        }
    }

    return (
        <div className="space-y-6 bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 p-10 rounded-2xl shadow-2xl shadow-purple-900/20 w-125">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-500 text-center uppercase tracking-wider">
                    Login
                </h1>

                <p className="text-slate-400 text-center font-light">
                    Entre com suas credenciais para continuar sua aventura.
                </p>

                <form className="space-y-4">
                    
                    <Input id="email" label="E-mail" type="email" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input id="password" label="Senha" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <ButtomConfirm text="Entrar" disabled={!isFormValid} onClick={() => handleLogin({ email, password })} />
                </form>

                <p className="text-center text-sm text-slate-400">
                    Ainda não tem conta?{' '}
                    <Link to="/register" className="text-purple-500 hover:text-purple-400 font-medium transition">
                        Registre-se aqui
                    </Link>
                    .
                </p>
            </div>


    );
}