import { DashboardLayout } from "../components/dashboardLayout";
import { Listagem } from "../components/listagem";

function Personagens() {
    return (
        <DashboardLayout
            title="Personagens"
            subtitle="Esse espaço vai concentrar a listagem e o gerenciamento dos personagens. Por enquanto fica só o esqueleto visual."
        >
            <Listagem
                title="Personagens"
                items={[]}
                emptyMessage="Nenhum personagem encontrado."
            />
        </DashboardLayout>
    );
}

export default Personagens;