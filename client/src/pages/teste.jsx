


import { useLocation } from "react-router";

function Teste() {

    const location = useLocation();

    return (
        <div>
            <h1>Bem-vindo, {location.state?.user?.nome}!</h1>
        </div>
    );
}

export default Teste;