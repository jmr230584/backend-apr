import { Request, RequestHandler, Response } from "express";
import { DatabaseModel } from "../model/DatabaseModel";
import bcrypt from "bcrypt";
import { Auth } from "../util/Auth"; 
import { QueryResult } from "pg";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

// conexão com banco
const database = new DatabaseModel().pool;

/**
 * Controller responsável por gerenciar as operações relacionadas ao usuário
 */
export class UsuarioController {
  static todos(arg0: string, todos: any) {
    throw new Error("Method not implemented.");
  }
  static cadastrar(arg0: string, arg1: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, cadastrar: any) {
    throw new Error("Method not implemented.");
  }
  /**
   * Cria um novo usuário no banco
   */
  static async criarUsuario(req: Request, res: Response): Promise<any> {
    try {
      const { nome, username, email, senha, imagem_perfil } = req.body;

      // valida se já existe usuário com mesmo email ou username
      const existe: QueryResult = await database.query(
        "SELECT * FROM usuario WHERE email = $1 OR username = $2",
        [email, username]
      );
      if ((existe.rowCount ?? 0) > 0) { // usa ?? 0 para garantir que nunca seja null
        return res
          .status(400)
          .json({ message: "Email ou username já cadastrados." });
      }

      // gera hash da senha
      const hashSenha = await bcrypt.hash(senha, 10);

      // insere usuário
      const query = `INSERT INTO usuario (nome, username, email, senha, imagem_perfil)
                     VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nome, username, email, imagem_perfil`;
      const values = [nome, username, email, hashSenha, imagem_perfil || null];
      const resultado = await database.query(query, values);

      return res.status(201).json({
        message: "Usuário criado com sucesso",
        usuario: resultado.rows[0],
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  /**
   * Lista todos os usuários
   */
  static async listarUsuarios(req: Request, res: Response): Promise<any> {
    try {
      const resultado = await database.query(
        "SELECT id_usuario, nome, username, email, imagem_perfil FROM usuario"
      );
      return res.status(200).json(resultado.rows);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  /**
   * Busca usuário por ID
   */
  static async buscarPorId(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const resultado = await database.query(
        "SELECT id_usuario, nome, username, email, imagem_perfil FROM usuario WHERE id_usuario = $1",
        [id]
      );

      if ((resultado.rowCount ?? 0) === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json(resultado.rows[0]);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  /**
   * Atualiza dados de um usuário
   */
  static async atualizarUsuario(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { nome, username, email, senha, imagem_perfil } = req.body;

      // busca se o usuário existe
      const existe = await database.query(
        "SELECT * FROM usuario WHERE id_usuario = $1",
        [id]
      );
      if ((existe.rowCount ?? 0) === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // se mandou senha, criptografa
      let senhaHash = existe.rows[0].senha;
      if (senha) {
        senhaHash = await bcrypt.hash(senha, 10);
      }

      const query = `UPDATE usuario
                     SET nome = $1, username = $2, email = $3, senha = $4, imagem_perfil = $5
                     WHERE id_usuario = $6 RETURNING id_usuario, nome, username, email, imagem_perfil`;
      const values = [
        nome || existe.rows[0].nome,
        username || existe.rows[0].username,
        email || existe.rows[0].email,
        senhaHash,
        imagem_perfil || existe.rows[0].imagem_perfil,
        id,
      ];

      const atualizado = await database.query(query, values);

      return res.status(200).json({
        message: "Usuário atualizado com sucesso",
        usuario: atualizado.rows[0],
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  /**
   * Deleta um usuário por ID
   */
  static async deletarUsuario(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      const resultado = await database.query(
        "DELETE FROM usuario WHERE id_usuario = $1 RETURNING id_usuario",
        [id]
      );

      if ((resultado.rowCount ?? 0) === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  /**
   * Login do usuário
   */
  static async login(req: Request, res: Response): Promise<any> {
    return Auth.validacaoUsuario(req, res);
  }
}