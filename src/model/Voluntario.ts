import { DatabaseModel } from "./DatabaseModel";
import bcrypt from 'bcrypt';


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

    private senha: string = "";     // Senha do voluntário
    private imagemPerfil: string = '';
    private uuidVoluntario: string = '';

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
        telefone: string,
        imagemPerfil: string
    ) {
        this.cpf = cpf;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.dataNascimento = dataNascimento;
        this.endereco = endereco;
        this.email = email;
        this.telefone = telefone;
        this.imagemPerfil = imagemPerfil
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

    public getSenha(): string { return this.senha; }
    public setSenha(senha: string): void { this.senha = senha; }

    public getImagemPerfil(): string {  return this.imagemPerfil;}
    public setImagemPerfil(imagem: string): void { this.imagemPerfil = imagem;}

    public getUuidVoluntario(): string { return this.uuidVoluntario; }
    public setUuidVoluntario(uuidVoluntario: string): void {this.uuidVoluntario = uuidVoluntario; }

    /* Métodos estáticos para manipulação no banco */

    static async buscarPorEmailESenha(email: string, senha: string): Promise<Voluntario | null> {
        
        try {
            const resultado = await database.query(
              `SELECT * FROM voluntario WHERE email = $1 AND senha = crypt($2, senha)`,
              [email, senha]
            );

        if (resultado.rows.length === 0) return null;

        const row = resultado.rows[0];
        return new Voluntario(
            row.cpf,
            row.nome,
            row.sobrenome,
            row.data_nascimento,
            row.endereco,
            row.email,
            row.telefone,
            row.imagem_perfil
        );
        } catch (error) {
            console.error("Erro ao buscar voluntário por email:", error);
            return null;
        }
    }


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
                    voluntario.telefone,
                    voluntario.imagemPerfil
                );
                novoVoluntario.setIdVoluntario(voluntario.id_voluntario);
                novoVoluntario.setStatusVoluntario(voluntario.status_voluntario);
                novoVoluntario.setUuidVoluntario(voluntario.uuid);
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
    static async cadastroVoluntario(voluntario: Voluntario): Promise<string | null> {
try {
            // Define a query SQL para inserir um novo voluntário com cpf, nome, sobrenome, data_nascimento, endereco, email, telefone, senha
            // A cláusula RETURNING uuid retorna o identificador gerado automaticamente pelo banco
            const query = `
          INSERT INTO voluntario (cpf, nome, sobrenome, data_nascimento, endereco, email, telefone, senha, imagem_perfil)
          VALUES ($1, $2, $3, $4, $5, $6, $7, crypt($8, gen_salt('bf')), $9)
          RETURNING uuid
        `;

            // Define os valores que serão usados na query (evita SQL Injection)
            const valores = [ voluntario.cpf, 
                              voluntario.nome, 
                              voluntario.sobrenome,
                              voluntario.dataNascimento,
                              voluntario.endereco,
                              voluntario.email, 
                              voluntario.telefone,
                              voluntario.senha,
                             voluntario.imagemPerfil];

            // Executa a query no banco de dados e aguarda a resposta
            const resultado = await database.query(query, valores);

            // Obtém o uuid gerado pelo banco de dados a partir do resultado da query
            const uuid = resultado.rows[0].uuid;

            // Atribui o uuid ao objeto do usuário, caso precise ser usado depois
            voluntario.uuidVoluntario = uuid;

            // Retorna o uuid como confirmação do cadastro
            return uuid;
        } catch (error) {
            // Em caso de erro, exibe no console para ajudar na identificação do problema
            console.error('Erro ao salvar voluntário:', error);

            // Retorna null para indicar que o cadastro não foi concluído
            return null;
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

    /**
     * Atualiza o caminho da imagem de perfil no cadastro do voluntário
     * @param uuid UUID do voluntário, que representará o nome da imagem
     * @param nomeArquivo O nome do arquivo a ser salvo
     */
    static async atualizarImagemPerfil(uuid: string, nomeArquivo: string): Promise<void> {
        // Define a query SQL que atualiza o campo imagem_perfil do usuário com o nome do arquivo
        const query = `UPDATE voluntario SET imagem_perfil = $1 WHERE uuid = $2`;

        // Executa a query passando o nome do arquivo e o uuid do usuário como parâmetros
        await database.query(query, [nomeArquivo, uuid]);
    }
}