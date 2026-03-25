export function DashboardNavbar() {
    return (
        <nav className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">RPG-Helper</p>
                <h1 className="text-xl font-bold text-slate-100 md:text-2xl">Painel de Campanhas</h1>
            </div>

            <div className="flex flex-wrap gap-2 text-sm font-medium">
                <button className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/20">
                    Dashboard
                </button>
                <button className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition hover:border-slate-400 hover:bg-slate-800">
                    Minhas Mesas
                </button>
                <button className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition hover:border-slate-400 hover:bg-slate-800">
                    Personagens
                </button>
                <button className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition hover:border-slate-400 hover:bg-slate-800">
                    Perfil
                </button>
            </div>
        </nav>
    );
}
