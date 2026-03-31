

import { FormsDashboard } from "../components/formsdashboard";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
    const { user } = useAuth();

    // Fallback para quando o contexto ainda não hidratou na primeira renderizacao
    const storedUser = localStorage.getItem("@RPG:user");
    let parsedUser = null;

    if (storedUser) {
        try {
            parsedUser = JSON.parse(storedUser);
        } catch {
            parsedUser = null;
        }
    }

    const currentUser = user || parsedUser || { nome: "Aventureiro", nickname: "" };

    return <FormsDashboard user={currentUser} />;
}

export default Dashboard;