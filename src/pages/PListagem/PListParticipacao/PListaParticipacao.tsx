// Importa o tipo JSX do React para tipagem do componente
import { JSX } from 'react';

// Importa o componente de cabeçalho
import Cabecalho from "../../../components/Cabecalho/Cabecalho";

// Importa o componente da tabela que lista os participações
import TabelaParticipacao from '../../../components/Tabelas/TabelaParticipacao/TabelaParticipacao';

// Componente funcional que representa a página de listagem de participações
function PListaParticipacao(): JSX.Element {
    return (
        <div className="pagina-grid">
            {/* Renderiza o cabeçalho da página */}
            <Cabecalho />

            {/* Renderiza a tabela com a lista de participações */}
            <TabelaParticipacao />

        </div>
    );
}

// Exporta o componente para uso em outras partes do projeto
export default PListaParticipacao;