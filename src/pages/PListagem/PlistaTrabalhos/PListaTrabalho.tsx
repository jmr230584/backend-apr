// Importa o tipo JSX do React para tipagem do componente
import { JSX } from 'react';

// Importa o componente de cabeçalho da aplicação
import Cabecalho from "../../../components/Cabecalho/Cabecalho";

// Importa o componente que renderiza a tabela de trabalhos
import TabelaTrabalho from '../../../components/Tabelas/TabelaTrabalho/TabelaTrabalho';

// Importa o componente que renderiza a tabela de trabalhos

// Componente funcional que representa a página de listagem de trabalhos
function PListagemTrabalhos(): JSX.Element {
    return (
        <div className="pagina-grid">
            {/* Renderiza o cabeçalho da página */}
            <Cabecalho />

            {/* Renderiza a tabela com a lista de trabalhos */}
            <TabelaTrabalho />

        </div>
    );
}

// Exporta o componente para uso em outras partes do projeto
export default PListagemTrabalhos;