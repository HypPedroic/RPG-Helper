
import { useParams, useNavigate } from "react-router";
import { DashboardLayout } from "../components/dashboardLayout";
import { MesaInfoSection } from "../components/mesaInfoSection";
import { MesaInviteSection } from "../components/mesaInviteSection";
import { MesaParticipantsSection } from "../components/mesaParticipantsSection";
import { MesaActionsSection } from "../components/mesaActionsSection";
import { MesaSessionsSection } from "../components/mesaSessionsSection";
import { useAuth } from "../hooks/useAuth";
import { useMesaPage } from "../hooks/useMesaPage";
import { useMesaRole } from "../hooks/useMesaRole";

function Mesa() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { role, isLoading: roleLoading, refetch: refetchRole } = useMesaRole(id);
    const {
        mesa,
        participantes,
        isLoading,
        isSessoesLoading,
        error,
        sessoes,
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
    } = useMesaPage(id, navigate);

    if (isLoading || roleLoading) {
        return (
            <DashboardLayout title="Carregando..." subtitle="Aguarde...">
                <div className="text-center text-slate-400">Carregando dados da mesa...</div>
            </DashboardLayout>
        );
    }

    if (error || !mesa) {
        return (
            <DashboardLayout title="Erro" subtitle="Não foi possível carregar a mesa">
                <div className="text-center text-red-400">{error}</div>
            </DashboardLayout>
        );
    }

    const isMestre = role === "mestre";
    const isCoMestre = role === "co-mestre";
    const podeGerenciar = isMestre || isCoMestre;

    return (
        <DashboardLayout
            title={mesa.titulo}
            subtitle={`Mesa de RPG | ${role ? `Seu papel: ${role}` : "Carregando..."}`}
        >
            <MesaInfoSection
                mesa={mesa}
                editando={editando}
                podeGerenciar={podeGerenciar}
                novoTitulo={novoTitulo}
                novaDescricao={novaDescricao}
                onNovoTituloChange={setNovoTitulo}
                onNovaDescricaoChange={setNovaDescricao}
                onEditar={() => setEditando(true)}
                onSalvar={handleAtualizarMesa}
                onCancelar={() => setEditando(false)}
            />

            <MesaInviteSection mesa={mesa} isMestre={isMestre} onRegenerarConvite={handleRegenerarConvite} />

            <MesaParticipantsSection
                participantes={participantes}
                mesa={mesa}
                podeGerenciar={podeGerenciar}
                onAlterarRole={handleAlterarRole}
                onRemoverParticipante={handleRemoverParticipante}
            />

            <MesaSessionsSection
                mesaId={id}
                sessoes={sessoes}
                isLoading={isSessoesLoading}
                error={sessoesError}
                podeGerenciar={podeGerenciar}
                onRefresh={refetchSessoes}
            />

            <MesaActionsSection
                isMestre={isMestre}
                user={user}
                mesa={mesa}
                participantes={participantes}
                onTransferenciaSucesso={async () => {
                    refetchRole();
                    await handleTransferenciaSucesso();
                }}
                onDeletarMesa={handleDeletarMesa}
                onSairDaMesa={handleSairDaMesa}
                onVoltar={() => navigate("/minhas-mesas")}
            />
        </DashboardLayout>
    );
}

export default Mesa;