import { DatabaseModel } from "./DatabaseModel";

// Armazena o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa o Trabalho voluntário.
 */
export class Trabalho {
    private idTrabalho: number = 0;
    private nomeTrabalho: string;
    private ongResponsavel: string;
    private localizacao: string;
    private dataInicio: Date;
    private dataTermino: Date;

    constructor(
        nomeTrabalho: string,
        ongResponsavel: string,
        localizacao: string,
        dataInicio: Date,
        dataTermino: Date
    ) {
        this.nomeTrabalho = nomeTrabalho;
        this.ongResponsavel = ongResponsavel;
        this.localizacao = localizacao;
        this.dataInicio = dataInicio;
        this.dataTermino = dataTermino;
    }

    /* Métodos get e set */
    public getIdTrabalho(): number {
        return this.idTrabalho;
    }

    public setIdTrabalho(idTrabalho: number): void {
        this.idTrabalho = idTrabalho;
    }

    public getNomeTrabalho(): string {
        return this.nomeTrabalho;
    }

    public setNomeTrabalho(nomeTrabalho: string): void {
        this.nomeTrabalho = nomeTrabalho;
    }

    public getOngResponsavel(): string {
        return this.ongResponsavel;
    }

    public setOngResponsavel(ongResponsavel: string): void {
        this.ongResponsavel = ongResponsavel;
    }

    public getLocalizacao(): string {
        return this.localizacao;
    }

    public setLocalizacao(localizacao: string): void {
        this.localizacao = localizacao;
    }

    public getDataInicio(): Date {
        return this.dataInicio;
    }

    public setDataInicio(dataInicio: Date): void {
        this.dataInicio = dataInicio;
    }

    public getDataTermino(): Date {
        return this.dataTermino;
    }

    public setDataTermino(dataTermino: Date): void {
        this.dataTermino = dataTermino;
    }

    /**
     * Lista todos os trabalhos cadastrados.
     */
    static async listagemTrabalhos(): Promise<Array<Trabalho> | null> {
        const listaDeTrabalhos: Array<Trabalho> = [];

        try {
            const querySelectTrabalho = 'SELECT * FROM trabalho';
            const respostaBD = await database.query(querySelectTrabalho);

            respostaBD.rows.forEach((linha: any) => {
                const novoTrabalho = new Trabalho(
                    linha.nomeTrabalho,
                    linha.ongResponsavel,
                    linha.localizacao,
                    linha.data_inicio,
                    linha.data_termino
                );

                novoTrabalho.setIdTrabalho(linha.id_trabalho);
                listaDeTrabalhos.push(novoTrabalho);
            });

            return listaDeTrabalhos;
        } catch (error) {
            console.error('Erro ao buscar lista de trabalhos:', error);
            return null;
        }
    }

    /**
     * Cadastra um novo trabalho.
     */
    static async cadastroTrabalho(trabalho: Trabalho): Promise<boolean> {
        try {
            const queryInsertTrabalho = `
                INSERT INTO trabalho (nomeTrabalho, ongResponsavel, localizacao, data_inicio, data_termino)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_trabalho;
            `;

            const valores = [
                trabalho.getNomeTrabalho(),
                trabalho.getOngResponsavel(),
                trabalho.getLocalizacao(),
                trabalho.getDataInicio(),
                trabalho.getDataTermino()
            ];

            const respostaBD = await database.query(queryInsertTrabalho, valores);

            if (respostaBD.rowCount !== 0) {
                console.log(`Trabalho cadastrado com sucesso. ID: ${respostaBD.rows[0].id_trabalho}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erro ao cadastrar trabalho:', error);
            return false;
        }
    }
}