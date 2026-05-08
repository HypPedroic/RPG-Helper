import { DashboardNavbar } from "./dashboardNavbar";

export function DashboardLayout({ title, subtitle, children }) {
    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(168,85,247,0.2),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.15),transparent_28%),radial-gradient(circle_at_60%_80%,rgba(99,102,241,0.16),transparent_30%)]" />

            <div className="relative mx-auto w-full max-w-6xl px-6 py-8 md:px-10 lg:px-12">
                <DashboardNavbar />

                <section className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur md:p-8">
                    <h1 className="mt-3 text-3xl font-bold text-slate-50 md:text-4xl">{title}</h1>
                    <p className="mt-2 max-w-2xl text-slate-400">{subtitle}</p>

                    <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-slate-400">
                        {children}
                    </div>
                </section>
            </div>
        </div>
    );
}