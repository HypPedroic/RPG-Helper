
import { useState } from "react";
import { Link } from "react-router";
import { Input } from "./input";
import { ButtomConfirm } from "./buttonConfirm";
import api from "../services/api";

async function registerUser(userData) {
    await api.post("/register", {
        nome: userData.nome,
        nickname: userData.nickname,
        email: userData.email,
        senha_hash: userData.password
    })
}

export function FormsRegister() {

    const [nome, setNome] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isEmailValid = (emailValue) => {
        const atIndex = emailValue.indexOf("@");

        if (atIndex <= 0) {
            return false;
        }

        const domainPart = emailValue.slice(atIndex + 2);
        return domainPart.includes(".");
    };

    const isPasswordConfirmValid = (passwordValue, confirmPasswordValue) => {
        return passwordValue === confirmPasswordValue;
    };

    const hasEmailError = email.trim() !== "" && !isEmailValid(email);

    const hasPasswordConfirmError = confirmPassword.trim() !== "" && !isPasswordConfirmValid(password, confirmPassword);

    const isFormValid = nome.trim() !== "" && nickname.trim() !== "" && email.trim() !== "" && isEmailValid(email) && password.trim() !== "" && confirmPassword.trim() !== "" && isPasswordConfirmValid(password, confirmPassword);

    return (
        <div className="space-y-6 bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 p-10 rounded-2xl shadow-2xl shadow-purple-900/20 w-125">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-500 text-center uppercase tracking-wider">
                    Registro
                </h1>

                <p className="text-slate-400 text-center font-light">
                    Crie sua conta para comecar a organizar suas campanhas.
                </p>

                <form className="space-y-4">
                    <Input id="nome" label="Nome completo" placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
                    <Input id="nickname" label="Nickname" placeholder="Seu nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    <Input
                        id="email"
                        label="E-mail"
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        hasError={hasEmailError}
                        errorMessage="E-mail inválido"
                    />
                    <Input id="password" label="Senha" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Input id="confirm-password" label="Confirmar senha" type="password" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} hasError={hasPasswordConfirmError} errorMessage="As senhas não coincidem" />

                    <ButtomConfirm text="Registrar" disabled={!isFormValid} onClick={async () => {
                        await registerUser({ nome, nickname, email, password });
                        alert("Registro realizado com sucesso! Volte para a página de login para acessar sua conta.");
                    }} />
                </form>

                <p className="text-center text-sm text-slate-400">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-purple-500 hover:text-purple-400 font-medium transition">
                        Faça login aqui
                    </Link>
                    .
                </p>
            </div>

    );
}