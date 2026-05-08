export function MesaInfoSection({
    mesa,
    editando,
    podeGerenciar,
    novoTitulo,
    onNovoTituloChange,
    novaDescricao,
    onNovaDescricaoChange,
    onEditar,
    onSalvar,
    onCancelar,
}) {
    return (
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">{mesa.titulo}</h2>
                {!editando && podeGerenciar && (
                    <button
                        onClick={onEditar}
                        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                    >
                        ✏️ Editar
                    </button>
                )}
            </div>

            {editando && podeGerenciar ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={novoTitulo}
                        onChange={(e) => onNovoTituloChange(e.target.value)}
                        placeholder="Título da mesa"
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:border-amber-500"
                    />
                    <textarea
                        value={novaDescricao}
                        onChange={(e) => onNovaDescricaoChange(e.target.value)}
                        placeholder="Descrição da mesa"
                        rows="4"
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:border-amber-500"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={onSalvar}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            ✓ Salvar
                        </button>
                        <button
                            onClick={onCancelar}
                            className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-300"
                        >
                            ✕ Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-slate-300">{mesa.descricao || "Sem descrição"}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div>
                            <span className="font-semibold text-slate-300">Mestre:</span> {mesa.mestre_id}
                        </div>
                        {mesa.sistema && (
                            <div>
                                <span className="font-semibold text-slate-300">Sistema:</span> {mesa.sistema}
                            </div>
                        )}
                        <div>
                            <span className="font-semibold text-slate-300">Criada em:</span>{" "}
                            {new Date(mesa.data_criacao).toLocaleDateString("pt-BR")}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
