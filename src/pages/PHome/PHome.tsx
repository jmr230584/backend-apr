// Importa o tipo JSX do React para tipar corretamente o retorno do componente
import { JSX, useEffect } from 'react';

// Importa o componente de cabeçalho da aplicação
import Cabecalho from "../../components/Cabecalho/Cabecalho";

// Importa o componente de boas-vindas
import Welcome from "../../components/Welcome/Welcome";

// Declara o componente funcional PHome, que representa a página inicial
function PHome(): JSX.Element {

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

    return (
        <div className="pagina-grid">
            {/* Renderiza o cabeçalho da página */}
            <Cabecalho />

            {/* Renderiza a mensagem de boas-vindas */}
            <Welcome />
        </div>
    );
}

// Exporta o componente para ser usado em outras partes do projeto
export default PHome;
