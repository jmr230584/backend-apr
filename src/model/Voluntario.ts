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

    public setCpf(cpf: string): void {
        this.cpf = this.cpf;
    }

    public getCpf(): string {
        return this.cpf;
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

    public gettelefone(): string {
        return this.telefone;
    }

    public settelefone(telefone: string): void {
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

    }

