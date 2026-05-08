export function MesaParticipantsSection({
    participantes,
    mesa,
    podeGerenciar,
    onAlterarRole,
    onRemoverParticipante,
}) {
    return (
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-slate-100">👥 Participantes ({participantes.length})</h3>
            <div className="space-y-2">
                {participantes.map((participante) => (
                    <div
                        key={participante.id_participantes || participante.usuario_id}
                        className="flex items-center justify-between rounded-lg border border-slate-600 bg-slate-800 p-4"
                    >
                        <div>
                            <p className="font-semibold text-slate-100">{participante.nickname}</p>
                            <p className="text-sm text-slate-400">
                                {participante.tipo_role === "mestre" && "🎭 Mestre"}
                                {participante.tipo_role === "co-mestre" && "🎭 Co-Mestre"}
                                {participante.tipo_role === "jogador" && "⚔️ Jogador"}
                            </p>
                        </div>

                        {podeGerenciar && participante.usuario_id !== mesa.mestre_id && participante.tipo_role !== "mestre" && (
                            <div className="flex gap-2">
                                <select
                                    onChange={(e) => onAlterarRole(participante.usuario_id, e.target.value)}
                                    value={participante.tipo_role}
                                    className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1 text-sm text-slate-100 outline-none"
                                >
                                    <option value="jogador">Jogador</option>
                                    <option value="co-mestre">Co-Mestre</option>
                                </select>
                                <button
                                    onClick={() => onRemoverParticipante(participante.usuario_id)}
                                    className="rounded-lg bg-red-500/80 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {participante.usuario_id === mesa.mestre_id && (
                            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                                Mestre da Mesa
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
