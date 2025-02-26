import { DatabaseModel } from "./DatabaseModel";

// Armazena o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa o Voluntário.
 */
export class Voluntario {

    /* Atributos */
    /* Identificador do Voluntário */
    private idVoluntario: number = 0;

    private cpf: string = "";

    /* Nome do Voluntário */
    private nome: string;
    /* Sobrenome do Voluntário */
    private sobrenome: string;
    /* Data de nascimento do Voluntário */
    private dataNascimento: Date;
    /* Endereço do Voluntário */
    private endereco: string;
    /* Email do Voluntário */
    private email: string;
    /* telefone do Voluntário */
    private telefone: string;
    static getSobrenome: any;
    static getEndereco: any;
    static getNome: any;
    static getEmail: any;

    /**
     * Construtor da classe Voluntário
     * @param cpf cpf do voluntário
     * @param nome Nome do Voluntário
     * @param sobrenome Sobrenome do Voluntário
     * @param dataNascimento Data de nascimento do Voluntário
     * @param endereco Endereço do Voluntário
     * @param email Email do Voluntário
     * @param telefone telefone do Voluntário
     */
    constructor(
        cpf : string,
        nome: string,
        sobrenome: string,
        dataNascimento: Date,
        endereco: string,
        email: string,
        telefone: string
    ) {
        this.cpf = cpf;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.dataNascimento = dataNascimento;
        this.endereco = endereco;
        this.email = email;
        this.telefone = telefone;
    }

    /* Métodos get e set */
    public getIdVoluntario(): number {
        return this.idVoluntario;
    }

    public setIdVoluntario(idVoluntario: number): void {
        this.idVoluntario = idVoluntario;
    }

    public getCpf(): string {
        return this.cpf;
    }

    public setCpf(_cpf: string): void {
        this.cpf = this.cpf;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getSobrenome(): string {
        return this.sobrenome;
    }

    public setSobrenome(sobrenome: string): void {
        this.sobrenome = sobrenome;
    }

    public getDataNascimento(): Date {
        return this.dataNascimento;
    }

    public setDataNascimento(dataNascimento: Date): void {
        this.dataNascimento = dataNascimento;
    }

    public getEndereco(): string {
        return this.endereco;
    }

    public setEndereco(endereco: string): void {
        this.endereco = endereco;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getTelefone(): string {
        return this.telefone;
    }

    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }

    /**
     * Busca e retorna uma lista de voluntários do banco de dados.
     * @returns Um array de objetos do tipo `Voluntario` em caso de sucesso ou `null` se ocorrer um erro.
     */
    static async listarVoluntarios(): Promise<Array<Voluntario> | null> {
        const listaDeVoluntarios: Array<Voluntario> = [];

        try {
            const querySelectVoluntarios = `SELECT * FROM voluntario`;
            const respostaBD = await database.query(querySelectVoluntarios);

            respostaBD.rows.forEach((linha: any) => {
                const novoVoluntario = new Voluntario(
                    linha.cpf,
                    linha.nome,
                    linha.sobrenome,
                    linha.data_nascimento,
                    linha.endereco,
                    linha.email,
                    linha.telefone
                );

                novoVoluntario.setIdVoluntario(linha.id_voluntario);
                novoVoluntario.setCpf(linha.cpf);

                listaDeVoluntarios.push(novoVoluntario);
            });

            return listaDeVoluntarios;
        } catch (error) {
            console.log('Erro ao buscar lista de voluntários');
            return null;
        }
    }

    /**
     * Cadastra um novo voluntário no banco de dados.
     * 
     * Esta função recebe um objeto `Voluntario`, extrai as informações de nome,sobrenome, CPF, enreco, email e 
     * telefone e realiza uma operação de inserção (INSERT) na tabela `voluntario` do banco de dados. Se o 
     * cadastro for bem-sucedido, a função retorna `true`, caso contrário, retorna `false`.
     * 
     * @param {Voluntario} _voluntario - Objeto contendo os dados do voluntario a ser cadastrado.
     * 
     * @returns {Promise<boolean>} - Retorna `true` se o voluntario for cadastrado com sucesso, 
     *                               ou `false` se ocorrer um erro ou falha na inserção.
     * 
     * @throws {Error} - Em caso de erro na consulta ao banco de dados, o erro é registrado no log.
     */
    static async cadastroVoluntario(_voluntario: Voluntario): Promise<boolean> {
        try {
            const queryInsertVoluntario = `INSERT INTO voluntario (cpf, nome, sobrenome, cpf, endero, email, telefone)
                                        VALUES
                                        ('${Voluntario.getCpf()}', '${Voluntario.getNome()}', '${Voluntario.getSobrenome()}', 
                                        '${Voluntario.getEndereco()}''${Voluntario.getEmail()}''${Voluntario.getTelefone()}')
                                        RETURNING id_cliente`;

            const respostaBD = await database.query(queryInsertVoluntario);

            if(respostaBD.rowCount != 0) {
                console.log(`Voluntário cadastrado com sucesso. ID de voluntário: ${respostaBD.rows[0].id_voluntario}`);
                return true;
            }

            return false;
        } catch (error) {
            console.log('Erro ao cadastrar o voluntário. Consulte os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }
    static getTelefone() {
        throw new Error("Method not implemented.");
    }
    static getCpf() {
        throw new Error("Method not implemented.");
    }
}

