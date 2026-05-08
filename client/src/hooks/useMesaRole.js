import { useState, useEffect, useCallback } from "react";
import { obterRoleMesa } from "../services/mesaApi";
import { useAuth } from "./useAuth";

/**
 * Hook para obter o role do usuário autenticado em uma mesa específica
 * @param {number} mesaId - ID da mesa
 * @returns {object} { role, isLoading, error, refetch }
 * role pode ser: 'mestre', 'co-mestre', 'jogador' ou null
 * refetch é uma função para forçar o recarregamento do role
 */
export function useMesaRole(mesaId) {
    const { user } = useAuth();
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const carregarRole = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await obterRoleMesa(mesaId);
            setRole(response.data.role);
            setError(null);
        } catch (err) {
            console.error("Erro ao carregar role do usuário:", err);
            setError(err.message);
            setRole(null);
        } finally {
            setIsLoading(false);
        }
    }, [mesaId]);

    useEffect(() => {
        if (mesaId && user) {
            carregarRole();
        }
    }, [mesaId, user, refreshTrigger, carregarRole]);

    const refetch = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    return { role, isLoading, error, refetch };
}
