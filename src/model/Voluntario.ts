import { DatabaseModel } from "./DatabaseModel";
import bcrypt from "bcrypt";

// Armazena o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa o Voluntário.
 */
export class Voluntario {
  private idVoluntario: number = 0;
  private cpf: string;
  private nome: string;
  private sobrenome: string;
  private dataNascimento: Date;
  private endereco: string;
  private email: string;
  private telefone: string;
  private statusVoluntario: boolean = true;
  private senha: string = "";
  private imagemPerfil: string = "";
  private uuidVoluntario: string = "";

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
    this.imagemPerfil = imagemPerfil;
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
  // Aqui a senha é criptografada com bcrypt antes de salvar
  public setSenha(senha: string): void {
    this.senha = bcrypt.hashSync(senha, 10);
  }

  public getImagemPerfil(): string { return this.imagemPerfil; }
  public setImagemPerfil(imagem: string): void { this.imagemPerfil = imagem; }

  public getUuidVoluntario(): string { return this.uuidVoluntario; }
  public setUuidVoluntario(uuidVoluntario: string): void { this.uuidVoluntario = uuidVoluntario; }

  /* Métodos estáticos para manipulação no banco */

  static async buscarPorEmail(email: string): Promise<any | null> {
    try {
      const resultado = await database.query(
        `SELECT * FROM voluntario WHERE email = $1`,
        [email]
      );

      if (resultado.rows.length === 0) return null;
      return resultado.rows[0];
    } catch (error) {
      console.error("Erro ao buscar voluntário por email:", error);
      return null;
    }
  }

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
          voluntario.imagem_perfil
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

  static async cadastroVoluntario(voluntario: Voluntario): Promise<string | null> {
    try {
      const query = `
        INSERT INTO voluntario (cpf, nome, sobrenome, data_nascimento, endereco, email, telefone, senha, imagem_perfil)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING uuid
      `;

      const valores = [
        voluntario.getCpf(),
        voluntario.getNome(),
        voluntario.getSobrenome(),
        voluntario.getDataNascimento(),
        voluntario.getEndereco(),
        voluntario.getEmail(),
        voluntario.getTelefone(),
        voluntario.getSenha(), // já vem criptografada
        voluntario.getImagemPerfil()
      ];

      const resultado = await database.query(query, valores);
      const uuid = resultado.rows[0].uuid;
      voluntario.setUuidVoluntario(uuid);
      return uuid;
    } catch (error) {
      console.error("Erro ao salvar voluntário:", error);
      return null;
    }
  }

  static async removerVoluntario(idVoluntario: number): Promise<boolean> {
    try {
      await database.query(
        `UPDATE participacao SET status_participacao_voluntario = FALSE WHERE id_voluntario = $1;`,
        [idVoluntario]
      );

      const result = await database.query(
        `UPDATE voluntario SET status_voluntario = FALSE WHERE id_voluntario = $1;`,
        [idVoluntario]
      );

      return result.rowCount !== 0;
    } catch (error) {
      console.error(`Erro na remoção: ${error}`);
      return false;
    }
  }

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
        voluntario.getCpf(),
        voluntario.getNome(),
        voluntario.getSobrenome(),
        voluntario.getDataNascimento(),
        voluntario.getEndereco(),
        voluntario.getTelefone(),
        voluntario.getEmail(),
        voluntario.getIdVoluntario()
      ];

      const result = await database.query(query, valores);
      return result.rowCount !== 0;
    } catch (error) {
      console.error(`Erro na atualização: ${error}`);
      return false;
    }
  }

  static async atualizarImagemPerfil(uuid: string, nomeArquivo: string): Promise<void> {
    const query = `UPDATE voluntario SET imagem_perfil = $1 WHERE uuid = $2`;
    await database.query(query, [nomeArquivo, uuid]);
  }
}
