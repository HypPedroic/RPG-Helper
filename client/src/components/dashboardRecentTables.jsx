export function DashboardRecentTables({ tables }) {
    return (
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/70 p-6 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-100">Ultimas mesas acessadas</h3>
                <span className="rounded-full border border-slate-600 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                    Exemplo visual
                </span>
            </div>

            <div className="space-y-3">
                {tables.map((mesa) => (
                    <article
                        key={mesa.id}
                        className="flex flex-col gap-2 rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-indigo-400/60 hover:bg-slate-800 md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <p className="text-base font-semibold text-slate-100">{mesa.nome}</p>
                            <p className="text-sm text-slate-400">Campanha registrada no sistema</p>
                        </div>

                        <div className="text-sm text-slate-300">
                            <span className="font-medium text-slate-200">Ultimo acesso:</span> {mesa.ultimoAcesso}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
