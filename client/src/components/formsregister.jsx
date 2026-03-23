
import { Link } from "react-router";
import { Input } from "./input";
import { ButtomConfirm } from "./buttonConfirm";
import { useRegisterValid } from "../hooks/RegisterValid";



export function FormsRegister() {
    const {
        nome, setNome,
        nickname, setNickname,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        hasEmailError,
        hasPasswordStrengthError,
        hasPasswordConfirmError,
        priorityWarning,
        isFormValid,
        isSubmitting,
        handleRegister,
    } = useRegisterValid();

    const handleSubmit = async (event) => {
        event.preventDefault();
        await handleRegister();
    };

    return (
        <div className="space-y-6 bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 p-10 rounded-2xl shadow-2xl shadow-purple-900/20 w-125">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-500 text-center uppercase tracking-wider">
                    Registro
                </h1>

                <p className="text-slate-400 text-center font-light">
                    Crie sua conta para comecar a organizar suas campanhas.
                </p>

                {priorityWarning ? <p className="text-sm text-amber-300">{priorityWarning}</p> : null}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input 
                        id="nome" 
                        label="Nome completo" 
                        placeholder="Seu nome completo" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                    />
                    <Input 
                        id="nickname" 
                        label="Nickname" 
                        placeholder="Seu nickname" 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)} 
                    />
                    <Input
                        id="email"
                        label="E-mail"
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        hasError={hasEmailError}
                        errorMessage="E-mail invalido"
                    />
                    <Input
                        id="password"
                        label="Senha"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        hasError={hasPasswordStrengthError}
                        errorMessage="Senha invalida: use pelo menos 8 caracteres"
                    />
                    <Input
                        id="confirm-password"
                        label="Confirmar senha"
                        type="password"
                        placeholder="********"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        hasError={hasPasswordConfirmError}
                        errorMessage="As senhas nao coincidem"
                    />

                    <ButtomConfirm text={isSubmitting ? "Registrando..." : "Registrar"} disabled={!isFormValid || isSubmitting} />
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