import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/dashboardLayout";
import { Listagem } from "../components/listagem";
import { obterMinhasMesas, criarMesa, entrarMesaComConvite } from "../services/mesaApi";

// Função para normalizar os dados que vêm do backend
const normalizarMesa = (mesa) => ({
    ...mesa,
    id: mesa.idmesa,
    nome: mesa.titulo,
    ultimoAcesso: mesa.data_criacao ? new Date(mesa.data_criacao).toLocaleDateString('pt-BR') : 'Data desconhecida',
});

function MinhasMesas() {
    const [isJoinMode, setIsJoinMode] = useState(false);
    const [inviteCode, setInviteCode] = useState("");
    const [mesaTitle, setMesaTitle] = useState("");
    const [mesasDoUsuario, setMesasDoUsuario] = useState([]);

    // Carregar mesas ao abrir a página
    useEffect(() => {
        const carregarMesas = async () => {
            try {
                const response = await obterMinhasMesas();
                const mesasNormalizadas = response.data.map(normalizarMesa);
                setMesasDoUsuario(mesasNormalizadas);
            } catch (error) {
                console.error("Erro ao carregar mesas:", error);
            }
        };

        carregarMesas();
    }, []);

    const handleCriarMesa = async (event) => {
        event.preventDefault();
        const titulo = mesaTitle.trim();
        if (!titulo) return;

        try {
            const response = await criarMesa(titulo);
            const mesaNormalizada = normalizarMesa(response.data);
            setMesasDoUsuario((prevMesas) => [mesaNormalizada, ...prevMesas]);
            setMesaTitle("");
        } catch (error) {
            console.error("Erro ao criar mesa:", error);
            alert("Erro ao criar mesa. Tente novamente.");
        }
    };

    const handleEntrarComConvite = async (event) => {
        event.preventDefault();
        if (!inviteCode.trim()) return;

        try {
            const response = await entrarMesaComConvite(inviteCode);
            const mesaNormalizada = normalizarMesa(response.data);
            setMesasDoUsuario((prevMesas) => [mesaNormalizada, ...prevMesas]);
            setInviteCode("");
        } catch (error) {
            console.error("Erro ao entrar na mesa:", error);
            alert("Erro ao entrar na mesa. Verifique o código de convite.");
        }
    };

    return (
        <DashboardLayout
            title="Minhas Mesas"
            subtitle="Confira todas as mesas em que você participa e entre em novas mesas usando convite."
        >
            <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-4 sm:p-6">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-slate-100">Criar nova mesa</h3>
                    <p className="text-sm text-slate-400">Informe apenas o título para criar sua mesa.</p>
                </div>

                <form onSubmit={handleCriarMesa} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <input
                        type="text"
                        value={mesaTitle}
                        onChange={(event) => setMesaTitle(event.target.value)}
                        placeholder="Título da mesa"
                        className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                    />
                    <button
                        type="submit"
                        className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                    >
                        Criar mesa
                    </button>
                </form>
            </section>

            <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-100">Entrar em uma mesa</h3>
                        <p className="text-sm text-slate-400">
                            Use um código de convite para participar de uma nova campanha.
                        </p>
                    </div>

                    {!isJoinMode ? (
                        <button
                            type="button"
                            onClick={() => setIsJoinMode(true)}
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Entrar em mesa
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setIsJoinMode(false);
                                setInviteCode("");
                            }}
                            className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-300 hover:text-white"
                        >
                            Sair do modo convite
                        </button>
                    )}
                </div>

                {isJoinMode ? (
                    <form onSubmit={handleEntrarComConvite} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(event) => setInviteCode(event.target.value)}
                            placeholder="Digite o código de convite"
                            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                        >
                            Confirmar convite
                        </button>
                    </form>
                ) : null}
            </section>

            <Listagem
                items={mesasDoUsuario}
                title="Mesas em que voce participa"
                searchPlaceholder="Buscar mesa..."
                emptyMessage="Nenhuma mesa encontrada para essa busca."
                getItemTitle={(mesa) => mesa.nome}
                getItemSubtitle={(mesa) => `Criada em: ${mesa.ultimoAcesso}`}
                getItemMeta={() => "Campanha registrada no sistema"}
                itemRouteBuilder={(mesa) => `/mesa/${mesa.id}`}
            />
        </DashboardLayout>
    );
}

export default MinhasMesas;