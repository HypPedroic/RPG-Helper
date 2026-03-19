

function Dashboard() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-r from-purple-900 to-indigo-900">
            <div className="space-y-6 bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 p-10 rounded-2xl shadow-2xl shadow-purple-900/20 w-125">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-500 text-center uppercase tracking-wider">
                    RPG-Helper
                </h1>
                <p className="text-slate-400 text-center font-light">
                    Sua jornada começa aqui. Organize suas campanhas com o poder da tecnologia.
                </p>
                <button className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95" onClick={() => {navigate('/login')}}>
                    INICIAR AVENTURA
                </button>
            </div>
        </div>
    );
}

export default Dashboard;