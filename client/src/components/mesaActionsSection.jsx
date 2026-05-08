import { TransferirMestragem } from "./transferirMestragem";

export function MesaActionsSection({
    isMestre,
    user,
    mesa,
    participantes,
    onTransferenciaSucesso,
    onDeletarMesa,
    onSairDaMesa,
    onVoltar,
}) {
    return (
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-slate-100">⚙️ Ações</h3>
            <div className="flex flex-wrap gap-3">
                {isMestre && (
                    <>
                        <TransferirMestragem
                            mesaId={mesa.idmesa}
                            mestres={[user]}
                            participantes={participantes.filter((p) => p.usuario_id !== mesa.mestre_id)}
                            onSuccess={onTransferenciaSucesso}
                        />
                        <button
                            onClick={onDeletarMesa}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            🗑️ Deletar Mesa
                        </button>
                    </>
                )}

                {!isMestre && (
                    <button
                        onClick={onSairDaMesa}
                        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 transition hover:border-red-400 hover:text-red-300"
                    >
                        🚪 Sair da Mesa
                    </button>
                )}

                <button
                    onClick={onVoltar}
                    className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-400"
                >
                    ← Voltar às Mesas
                </button>
            </div>
        </section>
    );
}
