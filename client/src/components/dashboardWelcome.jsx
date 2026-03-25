export function DashboardWelcome({ userName }) {
    return (
        <section className="mb-6 rounded-2xl border border-indigo-500/20 bg-linear-to-r from-indigo-500/15 via-slate-900/80 to-fuchsia-500/15 p-6 shadow-lg shadow-indigo-950/40">
            <p className="text-sm uppercase tracking-[0.22em] text-indigo-200/80">Bem-vindo de volta</p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-4xl">
                {userName}, sua proxima sessao comeca aqui.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
                Este espaco foi pensado para quem narra e para quem joga. Em breve, os dados serao carregados
                automaticamente pelo backend.
            </p>
        </section>
    );
}
