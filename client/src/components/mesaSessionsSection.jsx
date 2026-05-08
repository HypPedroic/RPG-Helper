import { useEffect, useState } from "react";
import {
    atualizarResumoPosJogo,
    atualizarSessao,
    concluirSessao,
    criarSessao,
    marcarPresenca,
    removerSessao,
} from "../services/sessaoApi";

const STATUS_LABELS = {
    agendada: "Agendada",
    confirmada: "Confirmada",
    cancelada: "Cancelada",
    concluida: "Concluida",
};

const STATUS_CLASSES = {
    agendada: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    confirmada: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    cancelada: "border-red-500/30 bg-red-500/10 text-red-300",
    concluida: "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

function formatarDataHora(value) {
    if (!value) {
        return "Sem data";
    }

    const data = new Date(value);

    if (Number.isNaN(data.getTime())) {
        return "Data inválida";
    }

    return data.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

function converterParaDatetimeLocal(value) {
    if (!value) {
        return "";
    }

    const data = new Date(value);

    if (Number.isNaN(data.getTime())) {
        return "";
    }

    const offset = data.getTimezoneOffset() * 60000;
    return new Date(data.getTime() - offset).toISOString().slice(0, 16);
}

function obterValorInicialDataHora() {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function MesaSessionsSection({
    mesaId,
    sessoes,
    isLoading,
    error,
    podeGerenciar,
    onRefresh,
}) {
    const [modalAberto, setModalAberto] = useState(false);
    const [sessaoEditando, setSessaoEditando] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataHora, setDataHora] = useState(obterValorInicialDataHora());
    const [linkEncontro, setLinkEncontro] = useState("");
    const [resumoPosJogo, setResumoPosJogo] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!modalAberto) {
            setSessaoEditando(null);
            setTitulo("");
            setDescricao("");
            setDataHora(obterValorInicialDataHora());
            setLinkEncontro("");
            setResumoPosJogo("");
        }
    }, [modalAberto]);

    const abrirNovaSessao = () => {
        setSessaoEditando(null);
        setTitulo("");
        setDescricao("");
        setDataHora(obterValorInicialDataHora());
        setLinkEncontro("");
        setResumoPosJogo("");
        setModalAberto(true);
    };

    const abrirEdicao = (sessao) => {
        setSessaoEditando(sessao);
        setTitulo(sessao.titulo ?? "");
        setDescricao(sessao.descricao ?? "");
        setDataHora(converterParaDatetimeLocal(sessao.data_hora));
        setLinkEncontro(sessao.link_encontro ?? "");
        setResumoPosJogo(sessao.resumo_pos_jogo ?? "");
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setSessaoEditando(null);
        setIsSaving(false);
    };

    const salvarSessao = async (event) => {
        event.preventDefault();

        const tituloLimpo = titulo.trim();
        const descricaoLimpa = descricao.trim();
        const linkLimpo = linkEncontro.trim();
        const resumoLimpo = resumoPosJogo.trim();

        if (!dataHora) {
            alert("Informe a data e hora da sessão.");
            return;
        }

        try {
            setIsSaving(true);

            const payload = {
                titulo: tituloLimpo || "Nova Sessão",
                descricao: descricaoLimpa || null,
                data_hora: new Date(dataHora).toISOString(),
                link_encontro: linkLimpo || null,
            };

            if (sessaoEditando) {
                await atualizarSessao(mesaId, sessaoEditando.id_sessao, payload);

                if (sessaoEditando.status === "concluida" && resumoLimpo !== (sessaoEditando.resumo_pos_jogo ?? "")) {
                    await atualizarResumoPosJogo(mesaId, sessaoEditando.id_sessao, resumoLimpo || null);
                }
            } else {
                await criarSessao(mesaId, {
                    ...payload,
                    resumo_pos_jogo: resumoLimpo || null,
                });
            }

            await onRefresh?.();
            fecharModal();
        } catch (err) {
            console.error("Erro ao salvar sessão:", err);
            alert(err?.response?.data?.error || "Erro ao salvar sessão");
        } finally {
            setIsSaving(false);
        }
    };

    const concluirSessaoDaLista = async (sessao) => {
        if (!window.confirm(`Concluir a sessão "${sessao.titulo}"?`)) {
            return;
        }

        try {
            await concluirSessao(mesaId, sessao.id_sessao);
            await onRefresh?.();
        } catch (err) {
            console.error("Erro ao concluir sessão:", err);
            alert(err?.response?.data?.error || "Erro ao concluir sessão");
        }
    };

    const excluirSessao = async (sessao) => {
        if (!window.confirm(`Excluir a sessão "${sessao.titulo}"?`)) {
            return;
        }

        try {
            await removerSessao(mesaId, sessao.id_sessao);
            await onRefresh?.();
        } catch (err) {
            console.error("Erro ao excluir sessão:", err);
            alert(err?.response?.data?.error || "Erro ao excluir sessão");
        }
    };

    const registrarPresenca = async (sessao, confirmado) => {
        try {
            await marcarPresenca(mesaId, sessao.id_sessao, { confirmado });
            await onRefresh?.();
        } catch (err) {
            console.error("Erro ao registrar presença:", err);
            alert(err?.response?.data?.error || "Erro ao registrar presença");
        }
    };

    const hasSessions = sessoes.length > 0;

    return (
        <>
            <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-100">📜 Sessões ({sessoes.length})</h3>
                        <p className="text-sm text-slate-400">
                            Acompanhe a agenda da mesa, confirme presença e gerencie as sessões.
                        </p>
                    </div>

                    {podeGerenciar && (
                        <button
                            type="button"
                            onClick={abrirNovaSessao}
                            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                        >
                            + Nova sessão
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <p className="text-slate-400">Carregando sessões...</p>
                ) : error ? (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                ) : hasSessions ? (
                    <div className="space-y-4">
                        {sessoes.map((sessao) => (
                            <article
                                key={sessao.id_sessao}
                                className="rounded-2xl border border-slate-700 bg-slate-950/40 p-5 shadow-lg shadow-slate-950/20"
                            >
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-lg font-semibold text-slate-100">{sessao.titulo}</h4>
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${STATUS_CLASSES[sessao.status] || STATUS_CLASSES.agendada}`}
                                            >
                                                {STATUS_LABELS[sessao.status] || sessao.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-400">
                                            {formatarDataHora(sessao.data_hora)}
                                        </p>

                                        {sessao.descricao ? (
                                            <p className="max-w-3xl text-sm leading-6 text-slate-300">
                                                {sessao.descricao}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-slate-500">Sem descrição informada.</p>
                                        )}

                                        {sessao.link_encontro ? (
                                            <a
                                                href={sessao.link_encontro}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                                            >
                                                Abrir link de encontro
                                            </a>
                                        ) : null}

                                        {sessao.resumo_pos_jogo ? (
                                            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                                                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                    Resumo pós-jogo
                                                </p>
                                                <p className="text-sm leading-6 text-slate-300">
                                                    {sessao.resumo_pos_jogo}
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-wrap gap-2 lg:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => registrarPresenca(sessao, true)}
                                            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-400 hover:text-emerald-200"
                                        >
                                            Confirmar presença
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => registrarPresenca(sessao, false)}
                                            className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:border-rose-400 hover:text-rose-200"
                                        >
                                            Não vou
                                        </button>

                                        {podeGerenciar && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => abrirEdicao(sessao)}
                                                    className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:bg-slate-700"
                                                >
                                                    Editar
                                                </button>
                                                {sessao.status !== "concluida" && sessao.status !== "cancelada" ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => concluirSessaoDaLista(sessao)}
                                                        className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:border-amber-400 hover:text-amber-200"
                                                    >
                                                        Concluir
                                                    </button>
                                                ) : null}
                                                <button
                                                    type="button"
                                                    onClick={() => excluirSessao(sessao)}
                                                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:text-red-200"
                                                >
                                                    Excluir
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-sm text-slate-400">
                        Nenhuma sessão cadastrada ainda. {podeGerenciar ? "Crie a primeira para organizar a campanha." : "Aguarde a agenda ser publicada."}
                    </div>
                )}
            </section>

            {modalAberto ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-2xl shadow-black/50">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h4 className="text-xl font-semibold text-slate-100">
                                    {sessaoEditando ? "Editar sessão" : "Nova sessão"}
                                </h4>
                                <p className="text-sm text-slate-400">
                                    Preencha as informações da sessão da mesa.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharModal}
                                className="rounded-full border border-slate-700 px-3 py-1 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={salvarSessao} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-200">Título</label>
                                    <input
                                        type="text"
                                        value={titulo}
                                        onChange={(event) => setTitulo(event.target.value)}
                                        placeholder="Ex.: O cerco ao castelo"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-200">Data e hora</label>
                                    <input
                                        type="datetime-local"
                                        value={dataHora}
                                        onChange={(event) => setDataHora(event.target.value)}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-200">Link de encontro</label>
                                    <input
                                        type="url"
                                        value={linkEncontro}
                                        onChange={(event) => setLinkEncontro(event.target.value)}
                                        placeholder="https://..."
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-200">Descrição</label>
                                    <textarea
                                        value={descricao}
                                        onChange={(event) => setDescricao(event.target.value)}
                                        rows="4"
                                        placeholder="Descreva o objetivo ou a proposta da sessão"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-200">Resumo pós-jogo</label>
                                    <textarea
                                        value={resumoPosJogo}
                                        onChange={(event) => setResumoPosJogo(event.target.value)}
                                        rows="4"
                                        placeholder="Opcional: anote o que aconteceu na sessão"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? "Salvando..." : "Salvar sessão"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
}