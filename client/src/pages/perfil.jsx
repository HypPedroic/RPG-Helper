import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/dashboardLayout";
import { useAuth } from "../hooks/useAuth";

function Perfil() {
	const navigate = useNavigate();
	const { user, signOut } = useAuth();

	const storedUser = localStorage.getItem("@RPG:user");
	let parsedUser = null;

	if (storedUser) {
		try {
			parsedUser = JSON.parse(storedUser);
		} catch {
			parsedUser = null;
		}
	}

	const currentUser = user || parsedUser || {
		nome: "Aventureiro",
		nickname: "",
		email: "",
	};

	function handleLogout() {
		signOut();
		navigate("/login", { replace: true });
	}

	return (
		<DashboardLayout
			title="Perfil do Jogador"
			subtitle={currentUser.nickname ? `Nickname: ${currentUser.nickname}` : "Seu espaço para revisar os dados da conta."}
		>
			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<span className="text-xs uppercase tracking-[0.24em] text-slate-500">Nome</span>
					<p className="mt-2 text-lg font-medium text-slate-100">{currentUser.nome}</p>
				</div>
				<div>
					<span className="text-xs uppercase tracking-[0.24em] text-slate-500">Nickname</span>
					<p className="mt-2 text-lg font-medium text-slate-100">{currentUser.nickname || "Não informado"}</p>
				</div>
				<div className="md:col-span-2">
					<span className="text-xs uppercase tracking-[0.24em] text-slate-500">E-mail</span>
					<p className="mt-2 text-lg font-medium text-slate-100">{currentUser.email || "Não informado"}</p>
				</div>

				<div className="md:col-span-2 mt-4 flex flex-col gap-3 sm:flex-row">
					<button
						type="button"
						onClick={() => navigate("/minhas-mesas")}
						className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
					>
						Voltar as mesas
					</button>
					<button
						type="button"
						onClick={handleLogout}
						className="rounded-xl bg-linear-to-r from-rose-500 to-orange-500 px-5 py-3 font-semibold text-white transition hover:brightness-110 active:scale-[0.99]"
					>
						Sair da conta
					</button>
				</div>
			</div>
		</DashboardLayout>
	);
}

export default Perfil;
