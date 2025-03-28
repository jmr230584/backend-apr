// Importa a classe DatabaseModel, que gerencia a conexão com o banco de dados
import { DatabaseModel } from "./DatabaseModel";

// Inicializa o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa um Trabalho Voluntário.
 * Esta classe modela os trabalhos voluntários cadastrados no sistema e fornece métodos para manipulação dos dados.
 */
export class Trabalho {
    // Atributos privados da classe, representando os dados do trabalho voluntário
    private idTrabalho: number = 0; // ID do trabalho, inicializado como 0 até ser atribuído pelo banco de dados
    private nomeTrabalho: string; // Nome do trabalho voluntário
    private ongResponsavel: string; // Nome da ONG responsável pelo trabalho
    private localizacao: string; // Local onde o trabalho será realizado
    private dataInicio: Date; // Data de início do trabalho
    private dataTermino: Date; // Data de término do trabalho

    /**
     * Construtor da classe Trabalho.
     * @param nomeTrabalho - Nome do trabalho voluntário
     * @param ongResponsavel - Nome da ONG responsável
     * @param localizacao - Localização onde ocorrerá o trabalho
     * @param dataInicio - Data de início do trabalho
     * @param dataTermino - Data de término do trabalho
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

    /* Métodos Getters e Setters */

    /**
     * Retorna o ID do trabalho.
     */
    public getIdTrabalho(): number {
        return this.idTrabalho;
    }

    /**
     * Define o ID do trabalho.
     * @param idTrabalho - Novo ID a ser atribuído ao trabalho.
     */
    public setIdTrabalho(idTrabalho: number): void {
        this.idTrabalho = idTrabalho;
    }

    /**
     * Retorna o nome do trabalho voluntário.
     */
    public getNomeTrabalho(): string {
        return this.nomeTrabalho;
    }

    /**
     * Define um novo nome para o trabalho voluntário.
     * @param nomeTrabalho - Nome atualizado do trabalho.
     */
    public setNomeTrabalho(nomeTrabalho: string): void {
        this.nomeTrabalho = nomeTrabalho;
    }

    /**
     * Retorna o nome da ONG responsável pelo trabalho.
     */
    public getOngResponsavel(): string {
        return this.ongResponsavel;
    }

    /**
     * Define uma nova ONG responsável pelo trabalho.
     * @param ongResponsavel - Nome atualizado da ONG.
     */
    public setOngResponsavel(ongResponsavel: string): void {
        this.ongResponsavel = ongResponsavel;
    }

    /**
     * Retorna a localização onde o trabalho será realizado.
     */
    public getLocalizacao(): string {
        return this.localizacao;
    }

    /**
     * Define uma nova localização para o trabalho voluntário.
     * @param localizacao - Endereço ou cidade onde o trabalho será realizado.
     */
    public setLocalizacao(localizacao: string): void {
        this.localizacao = localizacao;
    }

    /**
     * Retorna a data de início do trabalho.
     */
    public getDataInicio(): Date {
        return this.dataInicio;
    }

    /**
     * Define uma nova data de início para o trabalho.
     * @param dataInicio - Data de início atualizada.
     */
    public setDataInicio(dataInicio: Date): void {
        this.dataInicio = dataInicio;
    }

    /**
     * Retorna a data de término do trabalho.
     */
    public getDataTermino(): Date {
        return this.dataTermino;
    }

    /**
     * Define uma nova data de término para o trabalho.
     * @param dataTermino - Data de término atualizada.
     */
    public setDataTermino(dataTermino: Date): void {
        this.dataTermino = dataTermino;
    }

    /**
     * Método para listar todos os trabalhos cadastrados no banco de dados.
     * @returns Retorna um array de objetos do tipo Trabalho ou null em caso de erro.
     */
    static async listagemTrabalhos(): Promise<Array<Trabalho> | null> {
        const listaDeTrabalhos: Array<Trabalho> = [];

        try {
            // Query SQL para buscar todos os trabalhos cadastrados
            const querySelectTrabalho = 'SELECT * FROM trabalho';
            const respostaBD = await database.query(querySelectTrabalho);

            // Itera sobre os resultados e cria objetos Trabalho para cada registro encontrado
            respostaBD.rows.forEach((linha: any) => {
                const novoTrabalho = new Trabalho(
                    linha.nome_trabalho,   // Nome do trabalho voluntário
                    linha.ong_responsavel, // ONG responsável
                    linha.localizacao,     // Local onde ocorrerá o trabalho
                    linha.data_inicio,     // Data de início do trabalho
                    linha.data_termino     // Data de término do trabalho
                );

                // Define o ID do trabalho usando o valor recuperado do banco
                novoTrabalho.setIdTrabalho(linha.id_trabalho);
                listaDeTrabalhos.push(novoTrabalho);
            });

            return listaDeTrabalhos;
        } catch (error) {
            // Em caso de erro, exibe uma mensagem no console e retorna null
            console.error('Erro ao buscar lista de trabalhos:', error);
            return null;
        }
    }

    /**
     * Método para cadastrar um novo trabalho no banco de dados.
     * @param trabalho - Objeto do tipo Trabalho contendo os dados do novo trabalho.
     * @returns Retorna **true** se o cadastro foi bem-sucedido, **false** caso contrário.
     */
    static async cadastroTrabalho(trabalho: Trabalho): Promise<boolean> {
        try {
            // Query SQL para inserir um novo trabalho no banco de dados
            const queryInsertTrabalho = `
                INSERT INTO trabalho (nome_trabalho, ong_responsavel, localizacao, data_inicio, data_termino)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_trabalho;
            `;

            // Valores a serem inseridos, utilizando os getters do objeto Trabalho
            const valores = [
                trabalho.getNomeTrabalho(),
                trabalho.getOngResponsavel(),
                trabalho.getLocalizacao(),
                trabalho.getDataInicio(),
                trabalho.getDataTermino()
            ];

            // Executa a query de inserção no banco de dados
            const respostaBD = await database.query(queryInsertTrabalho, valores);

            // Verifica se houve inserção e retorna true se bem-sucedida
            if (respostaBD.rowCount !== 0) {
                console.log(`Trabalho cadastrado com sucesso. ID: ${respostaBD.rows[0].id_trabalho}`);
                return true;
            }

            return false;
        } catch (error) {
            // Em caso de erro, exibe mensagem no console e retorna false
            console.error('Erro ao cadastrar trabalho:', error);
            return false;
        }
    }
     /**
     * Remove um trabalho do banco de dados
     * @param id_trabalho ID do trabalho a ser removido
     * @returns Boolean indicando se a remoção foi bem-sucedida
    */
     static async removerTrabalho(id_trabalho: number): Promise<Boolean> {
        // variável de controle da execução da query
        let queryResult = false;

        try {
            // Cria a consulta para rmeover empréstimo do banco de dados
            const queryDeleteParticipacaoTrabalho = `UPDATE participacao
                                                    SET status_participacao_registro = FALSE 
                                                    WHERE id_trabalho=${id_trabalho}`;
                                                    
            // executa a query para remover participação
            await database.query(queryDeleteParticipacaoTrabalho
            );

            // Construção da query SQL para deletar o trabalho.
            const queryDeleteTrabalho = `UPDATE trabalho
                                        SET status_trabalho = FALSE 
                                        WHERE id_trabalho=${id_trabalho};`;

            // Executa a query de exclusão e verifica se a operação foi bem-sucedida.
            await database.query(queryDeleteTrabalho)
                .then((result) => {
                    if (result.rowCount != 0) {
                        queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                    }
                });

            // retorna o valor da variável de controle
            return queryResult;

        // captura qualquer erro que possa acontecer
        } catch (error) {
            // Exibe detalhes do erro no console
            console.log(`Erro na consulta: ${error}`);
            // retorna o valor fa variável de controle
            return queryResult;
        }
    }

    /**
     * Atualiza os dados de um trabalho no banco de dados.
     * @param trabalho Objeto do tipo trabalho com os novos dados
     * @returns true caso sucesso, false caso erro
     */
    static async atualizarCadastrotrabalho(Trabalho: Trabalho): Promise<Boolean> {
        let queryResult = false; // Variável para armazenar o resultado da operação.
        try {
            // Construção da query SQL para atualizar os dados do trabalho no banco de dados.
            const queryAtualizarTrabalho = `UPDATE trabalho SET 
                                           nome_trabalho = '${Trabalho.nomeTrabalho.toUpperCase()}',
                                           ong_responsavel = '${Trabalho.ongResponsavel.toUpperCase()}', 
                                           localizacao = '${Trabalho.localizacao.toUpperCase()}', 
                                           data_inicio = '${Trabalho.dataInicio.toISOString().split('T')[0]}', 
                                           data_termino = '${Trabalho.dataTermino.toISOString().split('T')[0]}' 
                                           WHERE id_trabalho = ${Trabalho.idTrabalho}`;

            // Executa a query de atualização e verifica se a operação foi bem-sucedida.
            await database.query(queryAtualizarTrabalho)
                .then((result) => {
                    if (result.rowCount != 0) {
                        queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                    }
                });

            // Retorna o resultado da operação para quem chamou a função.
            return queryResult;
        // captura qualquer erro que possa acontecer
        } catch (error) {
            // exibe detalhes do erro no console
            console.log(`Erro na consulta: ${error}`);
            // retorna o valor da variável de controle
            return queryResult;
        }
    }
}
