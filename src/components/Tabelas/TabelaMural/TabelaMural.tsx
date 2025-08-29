// Importa hooks e tipos do React
import { JSX, useEffect, useState } from 'react'; 

// Importa os componentes da biblioteca PrimeReact
import { DataTable } from 'primereact/datatable'; // Tabela responsiva com recursos como paginação e ordenação
import { Column } from 'primereact/column'; // Representa uma coluna da tabela
import { Button } from 'primereact/button'; // Botão estilizado da PrimeReact

// Importa o serviço responsável pelas requisições relacionadas a trabalhos do mural
import MuralRequests from '../../../fetch/MuralRequests';

// Importa o arquivo CSS com estilos específicos para este componente
import estilo from './TabelaMural.module.css';
import MuralTrabalhosDTO from '../../../Interfaces/MuralInterface';

// Declara o componente funcional TabelaMuralTrabalhos
function TabelaMuralTrabalhos(): JSX.Element {
    const [MuralTrabalhos, setMuralTrabalhos] = useState<MuralTrabalhosDTO[]>([]);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text className={estilo.botao} />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text className={estilo.botao} />;

    useEffect(() => {
        const fetchMural = async () => {
            try {
                const listaDeTrabalhosMural = await MuralRequests.listarMuralTrabalhos();
                setMuralTrabalhos(Array.isArray(listaDeTrabalhosMural) ? listaDeTrabalhosMural : []);
            } catch (error) {
                console.error(`Erro ao buscar trabalhos: ${error}`);
            }
        };

        fetchMural();
    }, []);

    return (
        <main className={estilo.cardsContainer}>
            <h1 className={estilo['header-tabela-mural']}>Mural de Trabalhos Concluídos</h1>

            <DataTable className={estilo['data-table']}
                value={MuralTrabalhos}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} de {last} total {totalRecords}"
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
            >
                <Column field="nomeTrabalho" header="Nome do Trabalho" style={{ width: '20%' }} />
                <Column field="ongResponsavel" header="Ong Responsável" style={{ width: '20%' }} />
                <Column field="totalVoluntarios" header="Total de Voluntários" style={{ width: '15%' }} />
                <Column
                    field="dataEncerramento"
                    header="Data de Encerramento"
                    style={{ width: '10%' }}
                    body={(rowData) => new Date(rowData.dataEncerramento).toLocaleDateString('pt-BR')}
                />
            </DataTable>
        </main>
    );
}

export default TabelaMuralTrabalhos;