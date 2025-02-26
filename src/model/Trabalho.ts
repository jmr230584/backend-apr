import { DatabaseModel } from "./DatabaseModel";

// Armazenei o pool de conexões
const database = new DatabaseModel().pool;

/**
 * Classe que representa o Trabalho voluntário.
 */
export class Trabalho {
    /* Atributos */
    private idTrabalho: number = 0;
    private nomeTrabalho: string;
    private ongResponsavel: string;
    private localizacao: string;
    private dataInicio: Date;
    private dataTermino: Date;
    /**
     * Construtor da classe Trabalho.
     * 
     * @param nomeTrabalho nome do trabalho.
     * @param ongResponsavel ong responsavel pelo trabalho.
     * @param localizacao localizacao do trabalho (Ativo, Concluído, Cancelado, etc.).
     * @param dataInicio Data de início do trabalho.
     * @param dataTermino Data de término do trabalho.
     */
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

    public getIdtrabalho(): number {
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
     * Busca e retorna uma lista de trabalhos voluntários do banco de dados.
     * @returns Um array de objetos do tipo Trabalho em caso de sucesso ou null se ocorrer um erro durante a consulta.
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
                    linha.data_Termino
                );

                novoTrabalho.setIdTrabalho(linha.id_trabalho);

                listaDeTrabalhos.push(novoTrabalho);
            });

            return listaDeTrabalhos;
        } catch (error) {
            console.log('Erro ao buscar lista de trabalhos');
            return null;
        }
    }

        /**
     * Realiza o cadastro de um trabalho no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `Trabalho` e insere seus dados
     * na tabela `trabalho` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * 
     * @param {Trabalho} trabalho - Objeto contendo os dados do trabalho que será cadastrado..
     * @returns {Promise<boolean>} - Retorna `true` se o trabalho foi cadastrado com sucesso e `false` caso contrário.
     *                               Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * 
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
     *                   no console junto com os detalhes do erro.
     */
    static async cadastroTrabalho(trabalho: Trabalho): Promise<boolean> {
        try {
            // query para fazer insert de um trabalho no banco de dados
            const queryInsertTrabalho = `INSERT INTO trabalho (nomeTrabalho, ongResponsavel, localizacao,data_inicio, data_Termino)
                                    VALUES
                                    ('${trabalho.getNomeTrabalho()}', 
                                    '${trabalho.getOngResponsavel()}', 
                                    ${trabalho.getLocalizacao()}, 
                                    '${trabalho.getDataInicio()}'),
                                    '${trabalho.getDataTermino()});
                                    RETURNING id_trabalho;`
            
            
            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertTrabalho);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Trabalho cadastrado com sucesso! ID do trabalho: ${respostaBD.rows[0].id_trabalho}`);
                // true significa que o cadastro foi feito
                return true;
            }

            // false significa que o cadastro NÃO foi feito.
            return false;

        } catch (error) {
            // imprime outra men
            // sagem junto com o erro
            console.log('Erro ao cadastrar o trabalho. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }
}
