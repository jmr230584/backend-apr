import { DatabaseModel } from "./DatabaseModel";

// Armazenei o pool de conexões
const database = new DatabaseModel().pool;

/**
 * Classe que representa o Status do Trabalho voluntário.
 */
export class StatusTrabalho {
    /* Atributos */
    private idStatus: number = 0;
    private idTrabalho: number = 0;
    private idVoluntario: number = 0;
    private quantidadeVagas: number;
    private duracao: string;
    private statusTrabalho: string;

    /**
     * Construtor da classe StatusTrabalho.
     * @param idStatus 
     * @param idTrabalho
     * @param idVoluntario
     * @param quantidadeVagas
     * @param duracao
     * @param statusTrabalho
     * 
     */
    constructor(idTrabalho: number,
        idVoluntario: number,
        quantidadeVagas: number,
        duracao: string,
        statusTrabalho: string
    ) {
        this.idTrabalho = idTrabalho;
        this.idVoluntario = idVoluntario;
        this.quantidadeVagas = quantidadeVagas;
        this.duracao = duracao;
        this.statusTrabalho = statusTrabalho;
    }

    public getIdStatus(): number {
        return this.idStatus;
    }

    public setIdStatu(idStatus: number): void {
        this.idStatus = idStatus;
    }

    public getIdTrabalho(): number {
        return this.idTrabalho;
    }

    public setIdTrabalho(idTrabalho: number): void {
        this.idTrabalho = idTrabalho;
    }


    public getIdVoluntario(): number {
        return this.idVoluntario;
    }

    public setIdVoluntario(idVoluntario: number): void {
        this.idVoluntario = idVoluntario;
    }


    public getQuantidadeVagas(): number {
        return this.quantidadeVagas;
    }

    public setQuantidadeVagas(quantidadeVagas: number): void {
        this.quantidadeVagas = quantidadeVagas;
    }

    public getDuracao(): string {
        return this.duracao;
    }

    public setDuracao(duracao: string): void {
        this.duracao = duracao;
    }

    public getStatusTrabalho(): string {
        return this.statusTrabalho;
    }



    public setStatusTrabalho(statusTrabalho: string): void {
        this.statusTrabalho = statusTrabalho;
    }




    static async listarStatus(): Promise<Array<StatusTrabalho> | null> {
        // Objeto para armazenar a lista de status
        const listaDeStatus: Array<StatusTrabalho> = [];

        try {
            // Query de consulta ao banco de dados
            const querySelectStatus = `SELECT * FROM status;`;

            // Fazendo a consulta e guardando a resposta
            const respostaBD = await database.query(querySelectStatus);

            // Usando a resposta para instanciar um objeto do tipo Status
            respostaBD.rows.forEach((linha: any) => {
                // Instancia (cria) objeto status
                const novoStatus = new StatusTrabalho(
                    linha.id_trabalho,
                    linha.id_voluntario,
                    linha.quantidade_vagas,
                    linha.duracao,
                    linha.status_trabalhos
                );

                // Atribui o ID ao objeto
                novoStatus.setIdStatu(linha.id_status);

                // Adiciona o objeto na lista
                listaDeStatus.push(novoStatus);
            });

            // Retorna a lista de status
            return listaDeStatus;
        } catch (error) {
            console.error('Erro ao buscar lista de status. Verifique os logs para mais detalhes.', error);
            return null;
        }
    }

    static async cadastrarStatus(
        idVoluntario: number,
        idTrabalho: number,
        quantidadeVagas: number,
        duracao: string,
        statusTrabalhos: string
    ): Promise<StatusTrabalho | null> {
        try {
            // Query de inserção no banco de dados
            const queryInsertStatus = `
                INSERT INTO status (id_trabalho, id_voluntario, quantidade_vagas, duracao, status_trabalho)`; // Retorna o registro inserido

            // Executa a query e guarda a resposta
            const respostaBD = await database.query(queryInsertStatus, [
                idTrabalho,
                idVoluntario,
                quantidadeVagas,
                duracao,
                statusTrabalhos,
            ]);

            // Verifica se a inserção foi bem-sucedida e se há dados retornados
            if (respostaBD.rows.length > 0) {
                const linha = respostaBD.rows[0]; // Pega o primeiro registro retornado

                // Cria um novo objeto StatusTrabalho com os dados inseridos
                const novoStatus = new StatusTrabalho(
                    linha.id_trabalho,
                    linha.id_voluntario,
                    linha.quantidade_vagas,
                    linha.duracao,
                    linha.status_trabalhos
                );

                // Atribui o ID ao objeto (caso o ID seja gerado automaticamente pelo banco de dados)
                novoStatus.setIdStatu(linha.id_status);

                // Retorna o objeto criado
                return novoStatus;
            } else {
                console.error('Nenhum registro foi inserido.');
                return null;
            }
        } catch (error) {
            console.error('Erro ao cadastrar status. Verifique os logs para mais detalhes.', error);
            return null;
        }
    }
}

