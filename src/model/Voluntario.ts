import { DatabaseModel } from "./DatabaseModel";

// Armazena o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa o Voluntário.
 */
export class Voluntario {
    /* Atributos */
    private idVoluntario: number = 0;
    private cpf: string;
    private nome: string;
    private sobrenome: string;
    private dataNascimento: Date;
    private endereco: string;
    private email: string;
    private telefone: string;

    /**
     * Construtor da classe Voluntário.
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

    public setCpf(cpf: string): void {
        this.cpf = cpf;
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
                listaDeVoluntarios.push(novoVoluntario);
            });

            return listaDeVoluntarios;
        } catch (error) {
            console.error('Erro ao buscar lista de voluntários:', error);
            return null;
        }
    }

    /**
     * Cadastra um novo voluntário no banco de dados.
     */
    static async cadastroVoluntario(voluntario: Voluntario): Promise<boolean> {
        try {
            const queryInsertVoluntario = `
                INSERT INTO voluntario (cpf, nome, sobrenome, data_nascimento, endereco, email, telefone)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id_voluntario;
            `;

            const valores = [
                voluntario.getCpf(),
                voluntario.getNome(),
                voluntario.getSobrenome(),
                voluntario.getDataNascimento(),
                voluntario.getEndereco(),
                voluntario.getEmail(),
                voluntario.getTelefone()
            ];

            const respostaBD = await database.query(queryInsertVoluntario, valores);

            if (respostaBD.rowCount !== 0) {
                console.log(`Voluntário cadastrado com sucesso. ID: ${respostaBD.rows[0].id_voluntario}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erro ao cadastrar o voluntário:', error);
            return false;
        }
    }
}