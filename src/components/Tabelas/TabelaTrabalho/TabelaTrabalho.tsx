// Importa hooks e tipos do React
import { JSX, useEffect, useState } from 'react'; 

// Importa os componentes da biblioteca PrimeReact
import { DataTable } from 'primereact/datatable'; // Tabela responsiva com recursos como paginação e ordenação
import { Column } from 'primereact/column'; // Representa uma coluna da tabela

// Importa o serviço responsável pelas requisições relacionadas a trabalhos
import TrabalhoRequests from '../../../fetch/TrabalhoRequests';

// Importa o arquivo CSS com estilos específicos para este componente
import estilo from './TabelaTrabalho.module.css';
import TrabalhoDTO from '../../../Interfaces/TrabalhosInterface';
import Cabecalho from '../../Cabecalho/Cabecalho';

// Declara o componente funcional TabelaTrabalho
function TabelaTrabalho(): JSX.Element {
    // Hook useState para armazenar a lista de trabalhos
    const [trabalhos, setTrabalhos] = useState<TrabalhoDTO[]>([]);

    // Hook useEffect para buscar os trabalhos na primeira renderização do componente
    useEffect(() => {
        const fetchTrabalhos = async () => {   // função para fazer a consulta de trabalhos
            try {
                const listaDeTrabalhos = await TrabalhoRequests.listarTrabalhos(); // Chamada assíncrona à API
                setTrabalhos(Array.isArray(listaDeTrabalhos) ? listaDeTrabalhos : []); // Atualiza o estado apenas se o retorno for um array
            } catch (error) {
                console.error(`Erro ao buscar trabalhos: ${error}`); // Exibe erro no console se a requisição falhar
            }
        }

        fetchTrabalhos(); // Executa a função de busca
    }, []); // Array vazio garante que será executado apenas uma vez (montagem do componente)

    // Função para renderizar os botões de ação (Editar e Excluir)
    const acoesTemplate = (rowData: any) => {
        return (
            <div className={estilo['td-acoes']}>
                <button
                    className={`${estilo['acao-btn']} ${estilo['editar-btn']}`}
                    onClick={() => console.log('Editar', rowData.id)}
                >
                    Editar
                </button>
                <button
                    className={`${estilo['acao-btn']} ${estilo['excluir-btn']}`}
                    onClick={() => console.log('Excluir', rowData.id)}
                >
                    Excluir
                </button>
            </div>
        );
    };

    return (
        <>
            <Cabecalho/>

            {/* Botões principais de navegação entre tabelas */}
            <div className={estilo['botoes-tabelas']}>
                <button onClick={() => window.location.href = '/tabelas?aba=voluntario'}>Voluntários</button>
                <button onClick={() => window.location.href = '/tabelas?aba=trabalho'}>Trabalhos</button>
                <button onClick={() => window.location.href = '/tabelas?aba=participacao'}>Participações</button>
            </div>

            <main className={estilo['table-trabalho-container']}>
                {/* Título da tabela */}
                <h1 className={estilo['header-tabela-trabalho']}>Lista de Trabalhos</h1>

                {/* Botões Adicionar e Voltar */}
                <div className={estilo['acoes-tabela']}>
                    <button
                        className={estilo['adicionar']}
                        onClick={() => console.log('Adicionar trabalho')}
                    >
                        Adicionar
                    </button>
                    <button
                        className={estilo['voltar']}
                        onClick={() => window.history.back()}
                    >
                        Voltar
                    </button>
                </div>

                {/* Tabela de Trabalhos */}
                <DataTable
                    value={trabalhos} // Fonte de dados da tabela
                    paginator // Ativa paginação
                    rows={5} // Mostra 5 registros por página
                    rowsPerPageOptions={[5, 10, 25, 50]} // Opções de quantidade de registros por página
                    tableStyle={{ minWidth: '50rem', margin: '0 auto' }} // centraliza
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} de {last} total {totalRecords}"
                    className={estilo['data-table']} // Classe CSS personalizada
                >
                    {/* Colunas que representam os atributos de cada trabalho */}
                    <Column field="nomeTrabalho" header="Nome Trabalho" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ color: '#3c1900' }} />
                    <Column field="OngResponsavel" header="Ong Responsável" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ color: '#3c1900' }} />
                    <Column field="localizacao" header="Localização" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ color: '#3c1900' }} />
                    <Column field="dataInicio" header="Data Início" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ color: '#3c1900' }}
                        body={(rowData) => new Date(rowData.dataInicio).toLocaleDateString('pt-BR')} />
                    <Column field="dataTermino" header="Data Término" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ color: '#3c1900' }}
                        body={(rowData) => new Date(rowData.dataTermino).toLocaleDateString('pt-BR')} />
                    <Column header="Ações" body={acoesTemplate} style={{ textAlign: 'center' }} />
                </DataTable>
            </main>
        </>
    );
}

// Exporta o componente para ser utilizado em outros arquivos
export default TabelaTrabalho;
