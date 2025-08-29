// Importa os hooks e componentes necessários
import { JSX, useEffect, useState } from 'react'; // Hooks do React para trabalhar com estado e efeitos colaterais
// Importa os componentes da biblioteca PrimeReact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// Importa o serviço responsável pelas requisições relacionadas a voluntarios
import VoluntarioRequests from '../../../fetch/VoluntarioRequests';
// Importa o arquivo CSS com estilos específicos para este componente
import estilo from './TabelaVoluntario.module.css'; // Importa os estilos específicos para este componente
import VoluntarioDTO from '../../../Interfaces/VoluntarioInterface';
//Importa o cabecalho
import  Cabecalho from '../../Cabecalho/Cabecalho'

/**
 * Componente que exibe uma tabela com os dados dos voluntarios.
 * Os dados são carregados da API assim que o componente é montado na tela.
 */


function TabelaVoluntario(): JSX.Element {
    // Hook useState: cria uma variável de estado chamada `voluntarios` para armazenar os dados dos voluntarios
    const [voluntarios, setVoluntarios] = useState<VoluntarioDTO[]>([]);

    /**
     * Hook useEffect: executa a função `fetchVoluntarios` assim que o componente for renderizado.
     * A função busca os voluntarios na API e armazena no estado.
     */
    useEffect(() => {
        const fetchVoluntarios = async () => {   // função para fazer a consulta de voluntarios
            try {
                const listaDeVoluntarios = await VoluntarioRequests.listarVoluntario(); // Requisição à API
                setVoluntarios(Array.isArray(listaDeVoluntarios) ? listaDeVoluntarios : []); // Atualiza o estado com os dados
            } catch (error) {
                console.error(`Erro ao buscar volintarios: ${error}`); // Exibe erro no console se a requisição falhar
            }
        };

        fetchVoluntarios();  // Executa a função de busca
    }, []); // Array vazio garante que será executado apenas uma vez (montagem do componente)

    return (
        <>
        <Cabecalho />
          {/* Botões de navegação entre tabelas */}
        <div className={estilo['botoes-tabelas']}>
           <button onClick={() => window.location.href = '/tabelas?aba=voluntario'}>Voluntários</button>
           <button onClick={() => window.location.href = '/tabelas?aba=trabalho'}>Trabalhos</button>
           <button onClick={() => window.location.href = '/tabelas?aba=participacao'}>Participações</button>
        </div>

        <main>
            {/* Título da tabela com classe personalizada */}
            <h1 className={estilo['h1-titulo']}>Lista de Voluntários</h1>

            {/* Componente DataTable: renderiza a tabela com os dados dos voluntarios */}
            <DataTable
                value={voluntarios} // Define os dados que serão exibidos
                paginator // Habilita paginação
                rows={5} // Quantidade de linhas por página
                rowsPerPageOptions={[5, 10, 25, 50]} // Opções de linhas por página
                tableStyle={{ minWidth: '50rem' }} // Estilização mínima da tabela
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" // Template da paginação
                currentPageReportTemplate="{first} de {last} total {totalRecords}" // Template do relatório da página
                className={estilo['data-table']} // Classe CSS personalizada
            >
                {/* Colunas da tabela, baseadas nos campos dos objetos de aluno */}
                <Column field="nome" header="Nome" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ width: '15%', color: 'var(--font-color)' }} />
                <Column field="sobrenome" header="Sobrenome" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ width: '15%', color: 'var(--font-color)' }} />
                <Column field="endereco" header="Endereço" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ width: '20%', color: 'var(--font-color)' }} />
                <Column field="email" header="E-mail" headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}} style={{ width: '20%', color: 'var(--font-color)' }} />

                {/* Coluna personalizada para exibir a data formatada */}
                <Column
                    field="dataNascimento"
                    header="Data Nascimento"
                    headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}}
                    style={{ width: '15%', color: 'var(--font-color)' }}
                    body={(rowData) => {
                        const data = new Date(rowData.dataNascimento);
                        const dia = String(data.getDate()).padStart(2, '0');
                        const mes = String(data.getMonth() + 1).padStart(2, '0');
                        const ano = data.getFullYear();
                        return `${dia}/${mes}/${ano}`;
                    }}
                />

                {/* Coluna personalizada para exibir o telefone formatado */}
                <Column
                    field="telefone"
                    header="Telefone"
                    headerStyle={{ backgroundColor: '#FBED9B', color: '#000'}}
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

export default TabelaVoluntario;