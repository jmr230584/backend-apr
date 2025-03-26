import { DatabaseModel } from "./DatabaseModel";

// Armazena o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa o Voluntário.
 */
export class Voluntario {
    /* Atributos */
    private idVoluntario: number = 0; // Armazena o ID único do voluntário
    private cpf: string; // Armazena o CPF do voluntário
    private nome: string; // Armazena o nome do voluntário
    private sobrenome: string; // Armazena o sobrenome do voluntário
    private dataNascimento: Date; // Armazena a data de nascimento do voluntário
    private endereco: string; // Armazena o endereço do voluntário
    private email: string; // Armazena o email do voluntário
    private telefone: string; // Armazena o telefone do voluntário

    /**
     * Construtor da classe Voluntário.
     * @param cpf - CPF do voluntário
     * @param nome - Nome do voluntário
     * @param sobrenome - Sobrenome do voluntário
     * @param dataNascimento - Data de nascimento do voluntário
     * @param endereco - Endereço do voluntário
     * @param email - Email do voluntário
     * @param telefone - Telefone do voluntário
     */
    constructor(
        cpf: string,
        nome: string,
        sobrenome: string,
        dataNascimento: Date,
        endereco: string,
        email: string,
        telefone: string
    ) {
        this.cpf = cpf; // Inicializa o atributo cpf
        this.nome = nome; // Inicializa o atributo nome
        this.sobrenome = sobrenome; // Inicializa o atributo sobrenome
        this.dataNascimento = dataNascimento; // Inicializa o atributo dataNascimento
        this.endereco = endereco; // Inicializa o atributo endereco
        this.email = email; // Inicializa o atributo email
        this.telefone = telefone; // Inicializa o atributo telefone
    }

    /* Métodos get e set */

    /**
     * Retorna o ID do voluntário.
     * @returns ID do voluntário
     */
    public getIdVoluntario(): number {
        return this.idVoluntario;
    }

    /**
     * Define o ID do voluntário.
     * @param idVoluntario - ID do voluntário
     */
    public setIdVoluntario(idVoluntario: number): void {
        this.idVoluntario = idVoluntario;
    }

    /**
     * Retorna o CPF do voluntário.
     * @returns CPF do voluntário
     */
    public getCpf(): string {
        return this.cpf;
    }

    /**
     * Define o CPF do voluntário.
     * @param cpf - CPF do voluntário
     */
    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    /**
     * Retorna o nome do voluntário.
     * @returns Nome do voluntário
     */
    public getNome(): string {
        return this.nome;
    }

    /**
     * Define o nome do voluntário.
     * @param nome - Nome do voluntário
     */
    public setNome(nome: string): void {
        this.nome = nome;
    }

    /**
     * Retorna o sobrenome do voluntário.
     * @returns Sobrenome do voluntário
     */
    public getSobrenome(): string {
        return this.sobrenome;
    }

    /**
     * Define o sobrenome do voluntário.
     * @param sobrenome - Sobrenome do voluntário
     */
    public setSobrenome(sobrenome: string): void {
        this.sobrenome = sobrenome;
    }

    /**
     * Retorna a data de nascimento do voluntário.
     * @returns Data de nascimento do voluntário
     */
    public getDataNascimento(): Date {
        return this.dataNascimento;
    }

    /**
     * Define a data de nascimento do voluntário.
     * @param dataNascimento - Data de nascimento do voluntário
     */
    public setDataNascimento(dataNascimento: Date): void {
        this.dataNascimento = dataNascimento;
    }

    /**
     * Retorna o endereço do voluntário.
     * @returns Endereço do voluntário
     */
    public getEndereco(): string {
        return this.endereco;
    }

    /**
     * Define o endereço do voluntário.
     * @param endereco - Endereço do voluntário
     */
    public setEndereco(endereco: string): void {
        this.endereco = endereco;
    }

    /**
     * Retorna o email do voluntário.
     * @returns Email do voluntário
     */
    public getEmail(): string {
        return this.email;
    }

    /**
     * Define o email do voluntário.
     * @param email - Email do voluntário
     */
    public setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Retorna o telefone do voluntário.
     * @returns Telefone do voluntário
     */
    public getTelefone(): string {
        return this.telefone;
    }

    /**
     * Define o telefone do voluntário.
     * @param telefone - Telefone do voluntário
     */
    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }

    /**
     * Busca e retorna uma lista de voluntários do banco de dados.
     * @returns Lista de voluntários ou null em caso de erro
     */
    static async listarVoluntarios(): Promise<Array<Voluntario> | null> {
        const listaDeVoluntarios: Array<Voluntario> = []; // Lista para armazenar os voluntários

        try {
            const querySelectVoluntarios = `SELECT * FROM voluntario`; // Query para selecionar todos os voluntários
            const respostaBD = await database.query(querySelectVoluntarios); // Executa a query no banco de dados

            // Itera sobre as linhas retornadas pelo banco de dados
            respostaBD.rows.forEach((linha: any) => {
                // Cria um novo objeto Voluntario com os dados da linha
                const novoVoluntario = new Voluntario(
                    linha.cpf,
                    linha.nome,
                    linha.sobrenome,
                    linha.data_nascimento,
                    linha.endereco,
                    linha.email,
                    linha.telefone
                );

                // Define o ID do voluntário
                novoVoluntario.setIdVoluntario(linha.id_voluntario);

                // Adiciona o voluntário à lista
                listaDeVoluntarios.push(novoVoluntario);
            });

            return listaDeVoluntarios; // Retorna a lista de voluntários
        } catch (error) {
            console.error('Erro ao buscar lista de voluntários:', error); // Loga o erro no console
            return null; // Retorna null em caso de erro
        }
    }

    /**
     * Cadastra um novo voluntário no banco de dados.
     * @param voluntario - Objeto Voluntario a ser cadastrado
     * @returns true se o cadastro foi bem-sucedido, false caso contrário
     */
    static async cadastroVoluntario(voluntario: Voluntario): Promise<boolean> {
        try {
            // Query para inserir um novo voluntário no banco de dados
            const queryInsertVoluntario = `
                INSERT INTO voluntario (cpf, nome, sobrenome, data_nascimento, endereco, email, telefone)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id_voluntario;
            `;

            // Valores a serem inseridos na query
            const valores = [
                voluntario.getCpf(),
                voluntario.getNome(),
                voluntario.getSobrenome(),
                voluntario.getDataNascimento(),
                voluntario.getEndereco(),
                voluntario.getEmail(),
                voluntario.getTelefone()
            ];

            // Executa a query no banco de dados
            const respostaBD = await database.query(queryInsertVoluntario, valores);

            // Verifica se o cadastro foi bem-sucedido
            if (respostaBD.rowCount !== 0) {
                console.log(`Voluntário cadastrado com sucesso. ID: ${respostaBD.rows[0].id_voluntario}`); // Loga o ID do voluntário cadastrado
                return true; // Retorna true em caso de sucesso
            }

            return false; // Retorna false em caso de falha
        } catch (error) {
            console.error('Erro ao cadastrar o voluntário:', error); // Loga o erro no console
            return false; // Retorna false em caso de erro
        }
    }


    /**
     * Remove um voluntário do banco de dados com base no ID fornecido.
     *
     * @param idVoluntario - O ID do voluntário a ser removido.
     * @returns Uma Promise que resolve para `true` se o voluntário foi removido com sucesso, ou `false` caso contrário.
     *
     * @throws Lança um erro se ocorrer um problema durante a execução da consulta.
     */
    static async removerVoluntario(idVoluntario: number): Promise<boolean> {
        try {
            const queryDeleteVoluntario = `DELETE FROM voluntario WHERE id_voluntario = ${idVoluntario}`;

            // Executa a query no banco de dados
            const respostaBD = await database.query(queryDeleteVoluntario);

            // Verifica se o delete foi bem-sucedido
            if(respostaBD.rowCount != 0) {
               console.log(`Voluntário removido com sucesso. ID removido: ${idVoluntario}`);
               return true; // Retorna true em caso de sucesso
            }

           return false; // Retorna false em caso de falha
        }  catch (error) {
            console.log('Erro ao remover o voluntário. Consulte os logs para mais detalhes.');
            console.log(error);
            return false; // Retorna false em caso de erro
        }
    }

    /**
     * Atualiza as informações de um voluntário no banco de dados.
     *
     * @param voluntario - O objeto voluntário contendo as informações atualizadas.
     * @returns Uma Promise que resolve para `true` se o voluntário foi atualizado com sucesso, ou `false` caso contrário.
     *
     * @throws Lança um erro se ocorrer um problema durante a atualização do voluntário.
     */
    static async atualizarVoluntario(voluntario: Voluntario): Promise<boolean> {
        try {
            const queryUpdateVoluntario = `UPDATE voluntario SET 
                                            cpf = '${voluntario.getCpf()}',
                                            nome = '${voluntario.getNome()}', 
                                            sobrenome = '${voluntario.getSobrenome()}',
                                            data_nascimento = '${voluntario.getDataNascimento()}',
                                            endereco = '${voluntario.getEndereco()}',
                                            email = '${voluntario.getEmail()}'
                                            telefone = '${voluntario.getTelefone()}',           
                                            WHERE id_voluntario = ${voluntario.getIdVoluntario()};`;

            // Executa a query no banco de dados
            const respostaBD = await database.query(queryUpdateVoluntario);
            
            // Verifica se o delete foi bem-sucedido
            if(respostaBD.rowCount != 0) {
                console.log(`Voluntário atualizado com sucesso. ID: ${voluntario.getIdVoluntario()}`);
                return true; // Retorna true em caso de sucesso
            }

            return false; // Retorna false em caso de falha
        } catch (error) {
            console.log('Erro ao remover o voluntário. Consulte os logs para mais detalhes.');
            console.log(error);
            return false; // Retorna false em caso de erro
        }
    }
}