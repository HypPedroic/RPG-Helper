import { useState } from "react";
import { transferirMestragem } from "../services/mesaApi";

/**
 * Componente para transferir mestragem para outro participante
 * Apenas mestres podem usar
 */
export function TransferirMestragem({ mesaId, participantes, onSuccess }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [novoMestreId, setNovoMestreId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleTransferir = async () => {
        if (!novoMestreId) {
            alert("Selecione um participante");
            return;
        }

        if (!window.confirm("Deseja realmente transferir a mestragem? Você se tornará co-mestre.")) {
            return;
        }

        try {
            setIsProcessing(true);
            await transferirMestragem(mesaId, parseInt(novoMestreId));
            alert("Mestragem transferida com sucesso!");
            setMostrarModal(false);
            setNovoMestreId("");
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Erro ao transferir mestragem:", err);
            alert("Erro ao transferir mestragem: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setMostrarModal(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                👑 Transferir Mestragem
            </button>

            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl border border-slate-600 bg-slate-900 p-6">
                        <h3 className="mb-4 text-lg font-bold text-slate-100">
                            Transferir Mestragem
                        </h3>

                        <p className="mb-4 text-sm text-slate-400">
                            Selecione qual participante será o novo mestre da mesa.
                        </p>

                        <select
                            value={novoMestreId}
                            onChange={(e) => setNovoMestreId(e.target.value)}
                            className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:border-blue-500"
                        >
                            <option value="">-- Selecione um participante --</option>
                            {participantes.map((p) => (
                                <option key={p.usuario_id} value={p.usuario_id}>
                                    {p.nickname} ({p.tipo_role})
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-3">
                            <button
                                onClick={handleTransferir}
                                disabled={isProcessing || !novoMestreId}
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isProcessing ? "Transferindo..." : "Transferir"}
                            </button>
                            <button
                                onClick={() => {
                                    setMostrarModal(false);
                                    setNovoMestreId("");
                                }}
                                className="flex-1 rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-400"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
