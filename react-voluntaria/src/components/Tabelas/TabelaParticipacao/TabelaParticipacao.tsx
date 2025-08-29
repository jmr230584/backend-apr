// Importa os hooks e componentes necessários
import { JSX, useEffect, useState } from 'react'; // Hooks do React para trabalhar com estado e efeitos colaterais

// Importa os componentes da biblioteca PrimeReact
import { DataTable } from 'primereact/datatable'; // Componente de tabela da biblioteca PrimeReact
import { Column } from 'primereact/column'; // Componente de coluna da tabela

// Importa o serviço responsável pelas requisições relacionadas a participações
import ParticipacaoRequests from '../../../fetch/ParticipacaoRequests'; // Importa a classe responsável pelas requisições das participações

// Importa o arquivo CSS com estilos específicos para este componente
import estilo from './TabelaParticipacao.module.css'; // Importa os estilos específicos para este componente
import ParticipacaoDTO from '../../../Interfaces/ParticipacaoInterface';
import Cabecalho from '../../Cabecalho/Cabecalho';

function TabelaParticipacao(): JSX.Element {
    // Define o estado local para armazenar os dados das participações
    const [participacoes, setParticipacoes] = useState<ParticipacaoDTO[]>([]);

    // Hook useEffect para buscar os dados de participações assim que o componente for montado
    useEffect(() => {
        // Função assíncrona para realizar a requisição das participações
        const fetchParticipacoes = async () => {
            try {
                const listaDeParticipacoes = await ParticipacaoRequests.listarParticipacao(); // Chamada à API
                // Atualiza o estado apenas se o retorno for um array
                setParticipacoes(Array.isArray(listaDeParticipacoes) ? listaDeParticipacoes : []);
            } catch (error) {
                console.error(`Erro ao buscar alunos: ${error}`); // Exibe erro no console se a requisição falhar
            }
        }

        fetchParticipacoes(); // Executa a função de busca
    }, []); // Array vazio indica que esse efeito será executado apenas uma vez (componenteDidMount)

    return (
        <>
        <Cabecalho/>
           {/* Botões de navegação entre tabelas */}
           <div className={estilo['botoes-tabelas']}>
           <button onClick={() => window.location.href = '/tabelas?aba=voluntario'}>Voluntários</button>
           <button onClick={() => window.location.href = '/tabelas?aba=trabalho'}>Trabalhos</button>
           <button onClick={() => window.location.href = '/tabelas?aba=participacao'}>Participações</button>
        </div>
        <main>
            {/* Título da tabela com classe personalizada */}
            <h1 className={estilo['header-tabela-participacao']}>Lista de Participações</h1>

            {/* Componente DataTable: renderiza a tabela com os dados das participações */}
            <DataTable
                value={participacoes} // Define os dados que serão exibidos
                paginator // Habilita paginação
                rows={5} // Quantidade de linhas por página
                rowsPerPageOptions={[5, 10, 25, 50]} // Opções de linhas por página
                tableStyle={{ minWidth: '50rem' }} // Estilização mínima da tabela
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" // Template da paginação
                currentPageReportTemplate="{first} de {last} total {totalRecords}" // Template do relatório da página
                className={estilo['data-table']} // Classe CSS personalizada
            >
                {/* Colunas da tabela, baseadas nos campos dos objetos de participação */}
                <Column field="voluntario.nome" header="Voluntário" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ width: '10%', color: '#fff' }} />
                <Column field="trabalho.nomeTrabalho" header="Trabalho" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ color: '#fff' }}/>

                {/* Colunas dos atributos da tabela */}
                <Column field="quantidadeVagas" header="Quantidade de Vagas" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ color: '#fff' }}/> 
                <Column field="duracao" header="Duração" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ color: '#fff' }}/> 
                <Column field="atividadeTrabalho" header="Atividade do Trabalho" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ color: '#fff' }}/> 


                {/* Coluna com o status da participação (ex: "pendente", "devolvido") */}
                <Column field="statusPartcipacaoVoluntario" header="Status da participação do Voluntário" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ width: '15%', color: '#fff' }} />
            </DataTable>
        </main>
        </>
    );
}

export default TabelaParticipacao; // Exporta o componente para ser usado em outras partes da aplicação