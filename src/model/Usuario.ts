import { DatabaseModel } from "./DatabaseModel";

// Recupera conexão com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa um usuário no sistema
 */
export class Usuario {
    private idUsuario: number = 0; // Identificador único do usuário
    private uuidUsuario: string = ''; // Identificador único universal do usuário
    private nome: string; // Nome do usuário
    private username: string; // Nome de usuário (login)
    private email: string; // Endereço de e-mail do usuário
    private senha: string = ''; // Senha do usuário
    private imagemPerfil: string = '' // Imagem de perfil do usuário

    /**
     * Construtor da classe Usuario
     * 
     * @param _nome Nome do Usuário
     * @param _username Nome de usuário (login)
     * @param _email Endereço de e-mail do usuário
     */
    constructor(
        _nome: string,
        _username: string,
        _email: string
    ) {
        this.nome = _nome;
        this.username = _username;
        this.email = _email;
    }

    /**
     * Retorna o ID do usuário
     * @returns idUsuario Identificador único do usuário
     */
    public getIdUsuario(): number {
        return this.idUsuario;
    }

    /**
     * Atribui um valor ao ID do usuário
     * @param idUsuario Identificador único do usuário
     */
    public setIdUsuario(idUsuario: number): void {
        this.idUsuario = idUsuario;
    }

    /**
     * Retorna o UUID do usuário
     * @returns uuidUsuario Identificador único universal do usuário
     */
    public getUuidUsuario(): string {
        return this.uuidUsuario;
    }

    /**
     * Atribui um valor ao UUID do usuário
     * @param uuidUsuario Identificador único universal do usuário
     */
    public setUuidUsuario(uuidUsuario: string): void {
        this.uuidUsuario = uuidUsuario;
    }

    /**
     * Retorna o nome do usuário
     * @returns nome Nome do usuário
     */
    public getNome(): string {
        return this.nome;
    }

    /**
     * Atribui um valor ao nome do usuário
     * @param nome Nome do usuário
     */
    public setNome(nome: string): void {
        this.nome = nome;
    }

    /**
     * Retorna o nome de usuário (login)
     * @returns username Nome de usuário
     */
    public getUsername(): string {
        return this.username;
    }

    /**
     * Atribui um valor ao nome de usuário
     * @param username Nome de usuário
     */
    public setUsername(username: string): void {
        this.username = username;
    }

    /**
     * Retorna o e-mail do usuário
     * @returns email Endereço de e-mail do usuário
     */
    public getEmail(): string {
        return this.email;
    }

    /**
     * Atribui um valor ao e-mail do usuário
     * @param email Endereço de e-mail do usuário
     */
    public setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Retorna a senha do usuário
     * @returns senha Senha do usuário
     */
    public getSenha(): string {
        return this.senha;
    }

    /**
     * Atribui um valor à senha do usuário
     * @param senha Senha do usuário
     */
    public setSenha(senha: string): void {
        this.senha = senha;
    }

    /**
     * Retorna a o caminho da imagem do usuario
     * @returns caminho da imagem do usuário
     */
    public getImagemPerfil(): string {
        return this.imagemPerfil;
    }

    /**
     * Atribui um valor à imagem do usuário
     * @param senha caminho da imagem do usuário
     */
    public setImagemPerfil(imagem: string): void {
        this.imagemPerfil = imagem;
    }

    /**
     * Retorna uma lista com todos os usuários cadastrados no banco de dados
     * @returns Lista com todos os usuários cadastrados ou null em caso de erro
     */
    static async listarUsuarios(): Promise<Array<Usuario> | null> {
        // Criando lista vazia para armzenar os usuários
        let listaDeUsuarios: Array<Usuario> = [];

        try {
            // Query para recuperar todos os usuários cadastrados
            const querySelectUsuarios = `SELECT * FROM usuario`;

            // Executa a query no banco de dados
            const respostaBD = await database.query(querySelectUsuarios);

            // Percorre os resultados da consulta
            respostaBD.rows.forEach((usuario) => {
                // Cria um novo objeto Usuario com os dados retornados
                let novoUsuario = new Usuario(
                    usuario.nome,
                    usuario.username,
                    usuario.email
                );

                // Atribui os valores adicionais ao objeto
                novoUsuario.setIdUsuario(usuario.id_usuario);
                novoUsuario.setUuidUsuario(usuario.uuid);

                // Adiciona o usuário à lista
                listaDeUsuarios.push(novoUsuario);
            });

            // Retorna a lista de usuários
            return listaDeUsuarios;
        } catch (error) {
            // Em caso de erro, exibe uma mensagem no console e retorna null
            console.log(`Erro ao recuperar usuários. ${error}`);
            return null;
        }
    }
}