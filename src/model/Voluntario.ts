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
    private statusVoluntario: boolean = true; // controla o status do voluntário

    private username: string = "";  // Nome de usuário para login
    private senha: string = "";     // Senha do voluntário

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

    /* Getters e Setters */

    public getIdVoluntario(): number { return this.idVoluntario; }
    public setIdVoluntario(idVoluntario: number): void { this.idVoluntario = idVoluntario; }

    public getCpf(): string { return this.cpf; }
    public setCpf(cpf: string): void { this.cpf = cpf; }

    public getNome(): string { return this.nome; }
    public setNome(nome: string): void { this.nome = nome; }

    public getSobrenome(): string { return this.sobrenome; }
    public setSobrenome(sobrenome: string): void { this.sobrenome = sobrenome; }

    public getDataNascimento(): Date { return this.dataNascimento; }
    public setDataNascimento(dataNascimento: Date): void { this.dataNascimento = dataNascimento; }

    public getEndereco(): string { return this.endereco; }
    public setEndereco(endereco: string): void { this.endereco = endereco; }

    public getEmail(): string { return this.email; }
    public setEmail(email: string): void { this.email = email; }

    public getTelefone(): string { return this.telefone; }
    public setTelefone(telefone: string): void { this.telefone = telefone; }

    public getStatusVoluntario(): boolean { return this.statusVoluntario; }
    public setStatusVoluntario(status: boolean): void { this.statusVoluntario = status; }

    public getUsername(): string { return this.username; }
    public setUsername(username: string): void { this.username = username; }

    public getSenha(): string { return this.senha; }
    public setSenha(senha: string): void { this.senha = senha; }

    /* Métodos estáticos para manipulação no banco */

    /**
     * Busca e retorna uma lista de voluntários do banco de dados.
     */
    static async listarVoluntarios(): Promise<Voluntario[] | null> {
        let listaDeVoluntarios: Voluntario[] = [];
        try {
            const query = `SELECT * FROM voluntario WHERE status_voluntario = TRUE;`;
            const respostaBD = await database.query(query);

            respostaBD.rows.forEach((voluntario: any) => {
                const novoVoluntario = new Voluntario(
                    voluntario.cpf,
                    voluntario.nome,
                    voluntario.sobrenome,
                    voluntario.data_nascimento,
                    voluntario.endereco,
                    voluntario.email,
                    voluntario.telefone
                );
                novoVoluntario.setIdVoluntario(voluntario.id_voluntario);
                novoVoluntario.setStatusVoluntario(voluntario.status_voluntario);
                listaDeVoluntarios.push(novoVoluntario);
            });

            return listaDeVoluntarios;
        } catch (error) {
            console.error(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo voluntário no banco de dados.
     */
    static async cadastroVoluntario(voluntario: Voluntario): Promise<boolean> {
        try {
            const query = `
                INSERT INTO voluntario 
                (cpf, nome, sobrenome, data_nascimento, endereco, email, telefone) 
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

            const respostaBD = await database.query(query, valores);

            if (respostaBD.rowCount !== 0) {
                console.log(`Voluntário cadastrado com sucesso. ID: ${respostaBD.rows[0].id_voluntario}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar o voluntário: ${error}`);
            return false;
        }
    }

    /**
     * Remove um voluntário do banco de dados.
     */
    static async removerVoluntario(idVoluntario: number): Promise<boolean> {
        try {
            // Remove participações associadas ao voluntário
            const queryParticipacao = `UPDATE participacao SET status_participacao_voluntario = FALSE WHERE id_voluntario = $1;`;
            await database.query(queryParticipacao, [idVoluntario]);

            // Remove voluntário (soft delete)
            const queryVoluntario = `UPDATE voluntario SET status_voluntario = FALSE WHERE id_voluntario = $1;`;
            const result = await database.query(queryVoluntario, [idVoluntario]);

            return result.rowCount !== 0;
        } catch (error) {
            console.error(`Erro na remoção: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza as informações de um voluntário no banco de dados.
     */
    static async atualizarVoluntario(voluntario: Voluntario): Promise<boolean> {
        try {
            const query = `
                UPDATE voluntario SET
                    cpf = $1,
                    nome = $2,
                    sobrenome = $3,
                    data_nascimento = $4,
                    endereco = $5,
                    telefone = $6,
                    email = $7
                WHERE id_voluntario = $8;
            `;

            const valores = [
                voluntario.getCpf().toUpperCase(),
                voluntario.getNome().toUpperCase(),
                voluntario.getSobrenome().toUpperCase(),
                voluntario.getDataNascimento(),
                voluntario.getEndereco().toUpperCase(),
                voluntario.getTelefone(),
                voluntario.getEmail().toLowerCase(),
                voluntario.getIdVoluntario()
            ];

            const result = await database.query(query, valores);
            return result.rowCount !== 0;
        } catch (error) {
            console.error(`Erro na atualização: ${error}`);
            return false;
        }
    }
}
