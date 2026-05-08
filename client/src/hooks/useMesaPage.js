import { useCallback, useEffect, useState } from "react";
import {
    atualizarMesa,
    deletarMesa,
    obterMesaPorId,
    obterParticipantesDaMesa,
    regenerarCodigoConvite,
    removerParticipante,
    sairDaMesa,
    alterarRoleParticipante,
} from "../services/mesaApi";
import { listarSessoesDaMesa } from "../services/sessaoApi";

export function useMesaPage(mesaId, navigate) {
    const [mesa, setMesa] = useState(null);
    const [participantes, setParticipantes] = useState([]);
    const [sessoes, setSessoes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSessoesLoading, setIsSessoesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessoesError, setSessoesError] = useState(null);
    const [editando, setEditando] = useState(false);
    const [novoTitulo, setNovoTitulo] = useState("");
    const [novaDescricao, setNovaDescricao] = useState("");

    const carregarDados = useCallback(async () => {
        if (!mesaId) {
            return;
        }

        try {
            setIsLoading(true);
            const [mesaResponse, participantesResponse] = await Promise.all([
                obterMesaPorId(mesaId),
                obterParticipantesDaMesa(mesaId),
            ]);

            setMesa(mesaResponse.data);
            setParticipantes(participantesResponse.data);
            setNovoTitulo(mesaResponse.data.titulo);
            setNovaDescricao(mesaResponse.data.descricao || "");
            setError(null);
        } catch (err) {
            console.error("Erro ao carregar dados da mesa:", err);
            setError("Erro ao carregar dados da mesa");
        } finally {
            setIsLoading(false);
        }
    }, [mesaId]);

    const carregarSessoes = useCallback(async () => {
        if (!mesaId) {
            return;
        }

        try {
            setIsSessoesLoading(true);
            const response = await listarSessoesDaMesa(mesaId);
            setSessoes(response.data);
            setSessoesError(null);
        } catch (err) {
            console.error("Erro ao carregar sessoes da mesa:", err);
            setSessoesError("Erro ao carregar sessoes da mesa");
        } finally {
            setIsSessoesLoading(false);
        }
    }, [mesaId]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    useEffect(() => {
        carregarSessoes();
    }, [carregarSessoes]);

    const handleAtualizarMesa = useCallback(async () => {
        try {
            const response = await atualizarMesa(mesaId, {
                titulo: novoTitulo,
                descricao: novaDescricao,
            });
            setMesa(response.data);
            setEditando(false);
            alert("Mesa atualizada com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar mesa:", err);
            alert("Erro ao atualizar mesa");
        }
    }, [mesaId, novoTitulo, novaDescricao]);

    const handleRegenerarConvite = useCallback(async () => {
        if (!window.confirm("Deseja regenerar o código de convite? O código anterior não funcionará mais.")) {
            return;
        }

        try {
            const response = await regenerarCodigoConvite(mesaId);
            setMesa(response.data);
            alert("Código de convite regenerado com sucesso!");
        } catch (err) {
            console.error("Erro ao regenerar convite:", err);
            alert("Erro ao regenerar convite");
        }
    }, [mesaId]);

    const handleDeletarMesa = useCallback(async () => {
        if (!window.confirm("Tem certeza que deseja deletar a mesa? Essa ação não pode ser desfeita.")) {
            return;
        }

        try {
            await deletarMesa(mesaId);
            alert("Mesa deletada com sucesso!");
            navigate("/minhas-mesas");
        } catch (err) {
            console.error("Erro ao deletar mesa:", err);
            alert("Erro ao deletar mesa");
        }
    }, [mesaId, navigate]);

    const handleSairDaMesa = useCallback(async () => {
        if (!window.confirm("Tem certeza que deseja sair da mesa?")) {
            return;
        }

        try {
            await sairDaMesa(mesaId);
            alert("Você saiu da mesa!");
            navigate("/minhas-mesas");
        } catch (err) {
            console.error("Erro ao sair da mesa:", err);
            alert("Erro ao sair da mesa");
        }
    }, [mesaId, navigate]);

    const handleAlterarRole = useCallback(async (usuarioId, novoRole) => {
        try {
            await alterarRoleParticipante(mesaId, usuarioId, novoRole);
            const response = await obterParticipantesDaMesa(mesaId);
            setParticipantes(response.data);
            alert("Role alterado com sucesso!");
        } catch (err) {
            console.error("Erro ao alterar role:", err);
            alert("Erro ao alterar role");
        }
    }, [mesaId]);

    const handleRemoverParticipante = useCallback(async (usuarioId) => {
        if (!window.confirm("Deseja remover este participante da mesa?")) {
            return;
        }

        try {
            await removerParticipante(mesaId, usuarioId);
            const response = await obterParticipantesDaMesa(mesaId);
            setParticipantes(response.data);
            alert("Participante removido com sucesso!");
        } catch (err) {
            console.error("Erro ao remover participante:", err);
            alert("Erro ao remover participante");
        }
    }, [mesaId]);

    const handleTransferenciaSucesso = useCallback(async () => {
        await carregarDados();
    }, [carregarDados]);

    const refetchSessoes = useCallback(async () => {
        await carregarSessoes();
    }, [carregarSessoes]);

    return {
        mesa,
        participantes,
        sessoes,
        isLoading,
        isSessoesLoading,
        error,
        sessoesError,
        editando,
        setEditando,
        novoTitulo,
        setNovoTitulo,
        novaDescricao,
        setNovaDescricao,
        handleAtualizarMesa,
        handleRegenerarConvite,
        handleDeletarMesa,
        handleSairDaMesa,
        handleAlterarRole,
        handleRemoverParticipante,
        handleTransferenciaSucesso,
        refetchSessoes,
    };
}
