// Importa os hooks e componentes necessários
import { JSX, useEffect, useState } from 'react';

// Importa os componentes da biblioteca PrimeReact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Importa o serviço responsável pelas requisições relacionadas a participações
import ParticipacaoRequests from '../../../fetch/ParticipacaoRequests';

// Importa o arquivo CSS com estilos específicos para este componente
import estilo from './TabelaParticipacao.module.css';
import ParticipacaoDTO from '../../../Interfaces/ParticipacaoInterface';
import Cabecalho from '../../Cabecalho/Cabecalho';

function TabelaParticipacao(): JSX.Element {
    // Estado local para armazenar os dados das participações
    const [participacoes, setParticipacoes] = useState<ParticipacaoDTO[]>([]);

    // Hook useEffect para buscar os dados de participações assim que o componente for montado
    useEffect(() => {
        const fetchParticipacoes = async () => {
            try {
                const listaDeParticipacoes = await ParticipacaoRequests.listarParticipacao();
                const participacoesComId = Array.isArray(listaDeParticipacoes)
                    ? listaDeParticipacoes.map((item, index) => ({ ...item, id: (item as any).id || index }))
                    : [];
                setParticipacoes(participacoesComId);
            } catch (error) {
                console.error(`Erro ao buscar participações: ${error}`);
            }
        };

        fetchParticipacoes();
    }, []);

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
            <Cabecalho />

            {/* Botões principais de navegação entre tabelas */}
            <div className={estilo['botoes-tabelas']}>
                <button onClick={() => window.location.href = '/tabelas?aba=voluntario'}>Voluntários</button>
                <button onClick={() => window.location.href = '/tabelas?aba=trabalho'}>Trabalhos</button>
                <button onClick={() => window.location.href = '/tabelas?aba=participacao'}>Participações</button>
            </div>

            <main className={estilo['table-participacao-container']}>
                {/* Título da tabela */}
                <h1 className={estilo['header-tabela-participacao']}>Lista de Participações</h1>

                {/* Botões Adicionar e Voltar */}
                <div className={estilo['acoes-tabela']}>
                    <button
                        className={estilo['adicionar']}
                        onClick={() => console.log('Adicionar participação')}
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

                {/* Tabela de Participações */}
                <DataTable
                    value={participacoes}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: '50rem', margin: '0 auto' }} // centraliza
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} de {last} total {totalRecords}"
                    className={estilo['data-table']}
                >
                    <Column field="voluntario.nome" header="Voluntário" />
                    <Column field="trabalho.nomeTrabalho" header="Trabalho" />
                    <Column field="quantidadeVagas" header="Quantidade de Vagas" />
                    <Column field="duracao" header="Duração" />
                    <Column field="atividadeTrabalho" header="Atividade do Trabalho" />
                    <Column field="statusPartcipacaoVoluntario" header="Status da Participação" style={{ width: '15%' }} />
                    <Column header="Ações" body={acoesTemplate} style={{ textAlign: 'center' }} />
                </DataTable>
            </main>
        </>
    );
}

export default TabelaParticipacao;
