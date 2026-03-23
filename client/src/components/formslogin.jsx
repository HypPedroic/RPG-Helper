
import { Link } from "react-router";
import { Input } from "./input";
import { ButtomConfirm } from "./buttonConfirm";
import { useLoginValid } from "../hooks/LoginValid";

export function FormsLogin() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        hasEmailError,
        isFormValid,
        isSubmitting,
        handleLogin,
    } = useLoginValid();

    const handleSubmit = async (event) => {
        event.preventDefault();
        await handleLogin();
    };

    return (
        <div className="space-y-6 bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 p-10 rounded-2xl shadow-2xl shadow-purple-900/20 w-125">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-500 text-center uppercase tracking-wider">
                    Login
                </h1>

                <p className="text-slate-400 text-center font-light">
                    Entre com suas credenciais para continuar sua aventura.
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    
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
                    />

                    <ButtomConfirm text={isSubmitting ? "Entrando..." : "Entrar"} disabled={!isFormValid || isSubmitting} />
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