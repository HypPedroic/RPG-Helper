export function MesaInviteSection({ mesa, isMestre, onRegenerarConvite }) {
    if (!isMestre) {
        return null;
    }

    return (
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-slate-100">🔗 Código de Convite</h3>
            <div className="space-y-4">
                <div className="rounded-lg border border-slate-600 bg-slate-800 p-4">
                    <p className="mb-2 text-sm text-slate-400">Compartilhe este código com jogadores:</p>
                    <code className="block text-lg font-mono font-bold text-emerald-400">
                        {mesa.link_convite}
                    </code>
                </div>
                <button
                    onClick={onRegenerarConvite}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                    🔄 Regenerar Código
                </button>
            </div>
        </section>
    );
}
