import { DashboardNavbar } from "./dashboardNavbar";
import { DashboardWelcome } from "./dashboardWelcome";
import { DashboardRecentTables } from "./dashboardRecentTables";

const EXAMPLE_USER = {
    nickname: "Aventureiro",
};

const EXAMPLE_TABLES = [
    { id: 1, nome: "A Maldicao de Ravenhill", ultimoAcesso: "Hoje, 14:22" },
    { id: 2, nome: "Cronicas de Eldoria", ultimoAcesso: "Ontem, 21:10" },
    { id: 3, nome: "As Ruinas de Khar-Tor", ultimoAcesso: "18/03/2026, 19:45" },
    { id: 4, nome: "Navegantes do Vazio", ultimoAcesso: "15/03/2026, 23:02" },
];

export function FormsDashboard({ user = EXAMPLE_USER, tables = EXAMPLE_TABLES }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(168,85,247,0.2),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.15),transparent_28%),radial-gradient(circle_at_60%_80%,rgba(99,102,241,0.16),transparent_30%)]" />

            <div className="relative mx-auto w-full max-w-6xl px-6 py-8 md:px-10 lg:px-12">
                <DashboardNavbar />
                <DashboardWelcome userName={user.nickname} />
                <DashboardRecentTables tables={tables} />
            </div>
        </div>
    );
}
