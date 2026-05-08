import { useLocation, useNavigate } from "react-router";

export function DashboardNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;
    const baseButtonClass = "rounded-lg border px-4 py-2 transition";
    const activeButtonClass = "border-cyan-400/30 bg-cyan-400/10 text-cyan-100";
    const inactiveButtonClass = "border-slate-600 text-slate-300 hover:border-slate-400 hover:bg-slate-800";

    return (
        <nav className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">RPG-Helper</p>
                <h1 className="text-xl font-bold text-slate-100 md:text-2xl">Painel de Campanhas</h1>
            </div>

            <div className="flex flex-wrap gap-2 text-sm font-medium">
                <button
                    type="button"
                    onClick={() => navigate("/minhas-mesas")}
                    className={`${baseButtonClass} ${isActive("/minhas-mesas") ? activeButtonClass : inactiveButtonClass}`}
                >
                    Minhas Mesas
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/personagens")}
                    className={`${baseButtonClass} ${isActive("/personagens") ? activeButtonClass : inactiveButtonClass}`}
                >
                    Personagens
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/perfil")}
                    className={`${baseButtonClass} ${isActive("/perfil") ? activeButtonClass : inactiveButtonClass}`}
                >
                    Perfil
                </button>
            </div>
        </nav>
    );
}
