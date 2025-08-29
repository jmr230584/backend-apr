// Importa hooks e tipos do React
import { JSX, useEffect, useState } from 'react'; 

// Importa os componentes da biblioteca PrimeReact
import { DataTable } from 'primereact/datatable'; // Tabela responsiva com recursos como paginação e ordenação
import { Column } from 'primereact/column'; // Representa uma coluna da tabela

// Importa o serviço responsável pelas requisições relacionadas a trabalhos
import TrabalhoRequests from '../../../fetch/TrabalhoRequests';

// Importa o arquivo CSS com estilos específicos para este componente
import './TabelaTrabalho.module.css';
import TrabalhoDTO from '../../../Interfaces/TrabalhosInterface';
import Cabecalho from '../../Cabecalho/Cabecalho';
import estilo from '../TabelaTrabalho/TabelaTrabalho.module.css';

/**
 * Componente que exibe uma tabela com os dados dos trabalhos (cadastros).
 * Os dados são carregados da API assim que o componente é montado na tela.
 */
function TabelaTrabalho(): JSX.Element {
    // Hook useState: cria uma variável de estado chamada `trabalhos` para armazenar os dados dos trabalhos/cadastros
    const [trabalhos, setTrabalhos] = useState<TrabalhoDTO[]>([]);

    /**
     * Hook useEffect: executa a função `fetchTrabalhos` assim que o componente for renderizado.
     * A função busca os trabalhos/cadastros na API e armazena no estado.
     */
    useEffect(() => {
        const fetchTrabalhos = async () => {
            try {
                const listaDeTrabalhos = await TrabalhoRequests.listarTrabalho();
                console.log('Dados recebidos da API:', listaDeTrabalhos); // DEBUG: verifique os dados aqui
                setTrabalhos(Array.isArray(listaDeTrabalhos) ? listaDeTrabalhos : []);
            } catch (error) {
                console.error(`Erro ao buscar trabalhos: ${error}`);
            }
        };

        fetchTrabalhos();
    }, []);

    return (
        <>
        <Cabecalho />
        <div className={estilo['botoes-tabelas']}>
           <button onClick={() => window.location.href = '/tabelas?aba=voluntario'}>Voluntários</button>
           <button onClick={() => window.location.href = '/tabelas?aba=trabalho'}>Trabalhos</button>
           <button onClick={() => window.location.href = '/tabelas?aba=participacao'}>Participações</button>
        </div>

        <main>
            <h1 className={estilo['h1-titulo']}>Lista de Trabalhos (Cadastros)</h1>

            <DataTable
                value={trabalhos}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: '60rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} de {last} total {totalRecords}"
                className={estilo['data-table']}
            >
                {/* Colunas baseadas nos campos do cadastro */}
                <Column field="cpf" header="CPF" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ width: '15%', color: 'var(--font-color)' }} />
                <Column field="username" header="Usuário" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ width: '15%', color: 'var(--font-color)' }} />
                <Column field="nome" header="Nome" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ width: '15%', color: 'var(--font-color)' }} />
                <Column field="sobrenome" header="Sobrenome" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ width: '15%', color: 'var(--font-color)' }} />
                <Column field="endereco" header="Endereço" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ width: '20%', color: 'var(--font-color)' }} />
                <Column field="email" header="E-mail" headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }} style={{ width: '20%', color: 'var(--font-color)' }} />

                {/* Coluna personalizada para exibir a data de nascimento formatada */}
                <Column
                    field="dataNascimento"
                    header="Data Nascimento"
                    headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }}
                    style={{ width: '15%', color: 'var(--font-color)' }}
                    body={(rowData) => {
                        const data = new Date(rowData.dataNascimento);
                        const dia = String(data.getDate()).padStart(2, '0');
                        const mes = String(data.getMonth() + 1).padStart(2, '0');
                        const ano = data.getFullYear();
                        return `${dia}/${mes}/${ano}`;
                    }}
                />

                {/* Coluna para telefone formatado */}
                <Column
                    field="telefone"
                    header="Telefone"
                    headerStyle={{ backgroundColor: '#FBED9B', color: '#000' }}
                    style={{ width: '15%', color: 'var(--font-color)' }}
                    body={(rowData) => {
                        const telefone = rowData.telefone?.replace(/\D/g, '');
                        if (!telefone || telefone.length < 10) return telefone;
                        return telefone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
                    }}
                />
            </DataTable>
        </main>
        </>
    );
}

export default TabelaTrabalho;
