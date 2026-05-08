

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

const EMPTY_ITEMS = [];
const defaultGetItemId = (item) => item.id;
const defaultGetItemTitle = (item) => item.nome || item.nomeCompleto || "Sem nome";
const defaultGetItemSubtitle = (item) => (item.ultimoAcesso ? `Ultimo acesso: ${item.ultimoAcesso}` : "");
const defaultGetItemSearchText = (item) => `${item.nome || ""} ${item.nomeCompleto || ""}`;
const defaultGetItemMeta = () => "";

export function Listagem({
    tables,
    items,
    title = "Mesas em que voce participa",
    totalLabel = "Total",
    searchPlaceholder = "Buscar...",
    emptyMessage = "Nenhum item encontrado para essa busca.",
    getItemId = defaultGetItemId,
    getItemTitle = defaultGetItemTitle,
    getItemSubtitle = defaultGetItemSubtitle,
    getItemSearchText = defaultGetItemSearchText,
    getItemMeta = defaultGetItemMeta,
    onItemClick,
    itemRouteBuilder,
    isItemClickable = true,
}) {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const listItems = items ?? tables ?? EMPTY_ITEMS;

    const handleItemClick = (item) => {
        if (!isItemClickable) return;

        if (onItemClick) {
            onItemClick(item);
            return;
        }

        if (itemRouteBuilder) {
            navigate(itemRouteBuilder(item));
            return;
        }

        if (item?.id !== undefined) {
            navigate(`/mesa/${item.id}`);
        }
    };

    const filteredTables = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return listItems;
        }

        return listItems.filter((item) =>
            getItemSearchText(item).toLowerCase().includes(normalizedSearch)
        );
    }, [getItemSearchText, listItems, search]);

    return (
        <section className="rounded-2xl ">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-100">{title}</h3>
                <span className="rounded-full border border-slate-600 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                    {totalLabel}: {filteredTables.length}
                </span>
            </div>

            <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                />
            </div>

            <div className="space-y-3">
                {filteredTables.length > 0 ? (
                    filteredTables.map((item) => {
                        const Component = isItemClickable ? "button" : "div";

                        return (
                            <Component
                                key={getItemId(item)}
                                type={isItemClickable ? "button" : undefined}
                                onClick={isItemClickable ? () => handleItemClick(item) : undefined}
                                className={`flex flex-wrap gap-2 rounded-xl border border-slate-700 bg-slate-800/60 p-4 md:flex-row md:items-center md:justify-between w-full h-full ${
                                    isItemClickable
                                        ? "transition hover:border-indigo-400/60 hover:bg-slate-800"
                                        : ""
                                }`}
                            >
                                <div>
                                    <p className="text-base font-semibold text-slate-100">{getItemTitle(item)}</p>
                                    {getItemSubtitle(item) ? (
                                        <p className="text-sm text-slate-400">{getItemSubtitle(item)}</p>
                                    ) : null}
                                </div>

                                {getItemMeta(item) ? (
                                    <span className="text-xs text-slate-400">{getItemMeta(item)}</span>
                                ) : null}
                            </Component>
                        );
                    })
                ) : (
                    <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-4 py-6 text-sm text-slate-400">
                        {emptyMessage}
                    </p>
                )}
            </div>
        </section>
    );
}