// Importa o tipo JSX do React para tipagem do componente
import { JSX } from 'react';

// Importa o componente de cabeçalho
import Cabecalho from '../../../components/Cabecalho/Cabecalho';

// Importa o componente da tabela que lista os voluntarios
import TabelaVoluntario from '../../../components/Tabelas/TabelaVoluntario/TabelaVoluntario';


// Componente funcional que representa a página de listagem de alunos
function PListaVoluntarios(): JSX.Element {
    return (
        <div className="pagina-grid">
            {/* Renderiza o cabeçalho da página */}
            <Cabecalho />

            {/* Renderiza a tabela com a lista de alunos */}
            <TabelaVoluntario />

        </div>
    );
}

// Exporta o componente para uso em outras partes do projeto
export default PListaVoluntarios;