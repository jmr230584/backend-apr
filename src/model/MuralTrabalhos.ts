// Importa a classe DatabaseModel, que gerencia a conexão com o banco de dados
import { DatabaseModel } from "./DatabaseModel";

// Inicializa o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa um Mural de trabalhos.
 * Esta classe modela os trabalhos voluntários cadastrados e finalizados no sistema e fornece métodos para manipulação dos dados.
 */
export class MuralTrabalhos {
    // Atributos privados da classe, representando os dados do trabalho voluntário
    private idMuralTrabalhos: number = 0; // ID do mural, inicializado como 0 até ser atribuído pelo banco de dados
    private nomeTrabalho: string; // Nome do trabalho voluntário
    private ongResponsavel: string; // Nome da ONG responsável pelo trabalho
    private totalVoluntarios: number; // Total de voluntários do trabalho finalizado
    private dataEncerramento: Date; // Data de término do trabalho
    private statusMuralTrabalho: boolean = true; //controla o status do trabalho


    /**
     * Construtor da classe Trabalho.
     * @param nomeTrabalho - Nome do trabalho voluntário
     * @param ongResponsavel - Nome da ONG responsável
     * @param totalVoluntarios - Localização onde ocorrerá o trabalho
     * @param dataEncerramento - Data de término do trabalho
     */
    constructor(
        nomeTrabalho: string,
        ongResponsavel: string,
        totalVoluntarios: number,
        dataEncerramento: Date
    ) {
        this.nomeTrabalho = nomeTrabalho;
        this.ongResponsavel = ongResponsavel;
        this.totalVoluntarios = totalVoluntarios;
        this.dataEncerramento = dataEncerramento;
    }

     /* Métodos Getters e Setters */

    /**
     * Retorna o ID do mural.
     */
    public getIdMuralTrabalhos(): number {
        return this.idMuralTrabalhos;
    }

    /**
     * Define o ID do mural.
     * @param idMuralTrabalhos - Novo ID a ser atribuído ao mural.
     */
    public setIdMuralTrabalhos(idMuralTrabalhos: number): void {
        this.idMuralTrabalhos = idMuralTrabalhos;
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
    public getTotalVoluntarios(): number {
        return this.totalVoluntarios;
    }

    /**
     * Define uma nova localização para o trabalho voluntário.
     * @param localizacao - Endereço ou cidade onde o trabalho será realizado.
     */
    public setTotalVoluntarios(totalVoluntarios: number): void {
        this.totalVoluntarios = totalVoluntarios;
    }


    /**
     * Retorna a data de encerramento do trabalho.
     */
    public getDataEncerramento(): Date {
        return this.dataEncerramento;
    }

    /**
     * Define uma nova data de encerramento para o trabalho.
     * @param dataEncerramento
     */
    public setDataEncerramento(dataEncerramento: Date): void {
        this.dataEncerramento = dataEncerramento;
    }


    /**
     * Retorna a status trabalho no sistema
     * 
     * @returns Status trabalho no sistema
     */
    public getStatusMuralTrabalho(): boolean {
        return this.statusMuralTrabalho;
    }

    /**
     * Atribui um valor ao status do trabalho
     * 
     * @param _statusMuralTrabalho : valor a ser atribuido ao status trabalho
     */
    public setStatusMuralTrabalho(_statusMuralTrabalho: boolean) {
        this.statusMuralTrabalho = _statusMuralTrabalho;
    }


    /**
     * Método para listar todos os trabalhos cadastrados no mural do banco de dados.
     * @returns Retorna um array de objetos do tipo MuralTrabalhos ou null em caso de erro.
     */
    static async listarTrabalhosMural(): Promise<Array<MuralTrabalhos> | null> {
        // Criando lista vazia para armazenar os trabalhos do mural
        let listaDeTrabalhosMural: Array<MuralTrabalhos> = [];

        try {
            // Query para consulta no banco de dados
            const querySelectMuralTrabalhos = `SELECT * FROM muralTrabalhos WHERE status_mural_trabalho`;

            // executa a query no banco de dados
            const respostaBD = await database.query(querySelectMuralTrabalhos);

            // percorre cada resultado retornado pelo banco de dados
            // trabalho é o apelido que demos para cada linha retornada do banco de dados
            respostaBD.rows.forEach((muralTrabalhos) => {
                // criando objeto trabalho
                let novoTrabalho = new MuralTrabalhos(
                    muralTrabalhos.nomeTrabalho,
                    muralTrabalhos.ongResponsavel,
                    muralTrabalhos.totalVoluntarios,
                    muralTrabalhos.dataEncerramento
                );
                // adicionando o ID ao objeto
                novoTrabalho.setIdMuralTrabalhos(muralTrabalhos.id_mural_trabalhos);

                // adicionando um trabalho na lista
                listaDeTrabalhosMural.push(novoTrabalho);
            });

            // retornado a lista de trabalhos para quem chamou a função
            return listaDeTrabalhosMural;
        
        // captura qualquer erro que aconteça
        } catch (error) {
            // exibe detalhes do erro no console
            console.log(`Erro ao acessar o modelo: ${error}`);
            // retorna um valor nulo
            return null;
        }
    }

/**
     * Método para cadastrar um novo trabalho no banco de dados.
     * @param muralTrabalhos - Objeto do tipo muralTrabalhos contendo os dados do novo trabalho.
     * @returns Retorna **true** se o cadastro foi bem-sucedido, **false** caso contrário.
     */
    static async novoTrabalhoMural(trabalho: MuralTrabalhos): Promise<boolean> {
        try {
            // Query SQL para inserir um novo trabalho no banco de dados
            const queryInsertTrabalhosMural = `
                INSERT INTO trabalho (nome_trabalho, ong_responsavel, total_voluntarios, data_encerramento)
                VALUES ($1, $2, $3, $4)
                RETURNING id_mural_trabalhos;
            `;

            // Valores a serem inseridos, utilizando os getters do objeto MuralTrabalhos
            const valores = [
                trabalho.getNomeTrabalho(),
                trabalho.getOngResponsavel(),
                trabalho.getTotalVoluntarios(),
                trabalho.getDataEncerramento()
            ];

            // Executa a query de inserção no banco de dados
            const respostaBD = await database.query(queryInsertTrabalhosMural, valores);

            // Verifica se houve inserção e retorna true se bem-sucedida
            if (respostaBD.rowCount !== 0) {
                console.log(`Trabalho cadastrado com sucesso ao mural. ID: ${respostaBD.rows[0].id_mural_trabalhos}`);
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
     * @param id_mural_trabalhos ID do trabalho a ser removido
     * @returns Boolean indicando se a remoção foi bem-sucedida
    */
     static async removerTrabalhoMural(id_mural_trabalhos: number): Promise<Boolean> {
        // variável de controle da execução da query
        let queryResult = false;

        try {
            // Cria a consulta para remover trabalho do banco de dados
            const queryDeleteTrabalhoMural = `UPDATE muralTrabalhos
                                                     WHERE id_mural_trabalhos=${id_mural_trabalhos}`;
                                                    
            // executa a query para remover participação
            await database.query(queryDeleteTrabalhoMural);

            // Construção da query SQL para deletar o trabalho.
            const queryDeleteTrabalhos = `UPDATE muralTrabalhos
                                           SET status_mural_trabalho
                                          WHERE id_mural_trabalhos=${id_mural_trabalhos};`;

            // Executa a query de exclusão e verifica se a operação foi bem-sucedida.
            await database.query(queryDeleteTrabalhos)
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
     * Atualiza as informações de um Mural trabalho no banco de dados.
     *
     * @param muralTrabalhos - O objeto trabalho contendo as informações atualizadas.
     * @returns Uma Promise que resolve para `true` se o trabalho foi atualizado com sucesso, ou `false` caso contrário.
     *
     * @throws Lança um erro se ocorrer um problema durante a atualização do trabalho.
     */
    static async atualizarTrabalhoMural(MuralTrabalhos: MuralTrabalhos): Promise<Boolean> {
        let queryResult = false; // Variável para armazenar o resultado da operação.
        try {
            // Construção da query SQL para atualizar os dados do voluntário no banco de dados.
            const queryAtualizarTrabalhoMural =`UPDATE muralTrabalhos SET 
                                                  status_mural_trabalho = '${MuralTrabalhos.getStatusMuralTrabalho()}',
                                                  nome_trabalho = '${MuralTrabalhos.getNomeTrabalho().toUpperCase()}',
                                                  ong_responsavel = '${MuralTrabalhos.getOngResponsavel().toUpperCase()}',
                                                  total_voluntarios = '${MuralTrabalhos.getTotalVoluntarios()}',
                                                  data_encerramento = '${MuralTrabalhos.getDataEncerramento()}'
                                                WHERE id_mural_trabalhos = ${MuralTrabalhos.idMuralTrabalhos}`;
            // Executa a query de atualização e verifica se a operação foi bem-sucedida.
            await database.query(queryAtualizarTrabalhoMural)
            .then((result) => {
                if (result.rowCount != 0) {
                    queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                }
            });

            // Retorna o resultado da operação para quem chamou a função.
            return queryResult;
        } catch (error) {
            // Em caso de erro na consulta, exibe o erro no console e retorna false.
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }
}