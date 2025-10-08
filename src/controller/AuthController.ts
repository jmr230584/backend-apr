import { Request, Response } from "express";
import { Voluntario } from "../model/Voluntario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET as string;

export class AuthController {
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ auth: false, message: "Email e senha são obrigatórios" });
      }

      // Busca voluntário pelo email
      const voluntario = await Voluntario.buscarPorEmail(email);
      if (!voluntario) {
        return res.status(401).json({ auth: false, message: "Email ou senha incorretos" });
      }

      // Compara a senha digitada com a do banco
      const senhaCorreta = await bcrypt.compare(senha, voluntario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ auth: false, message: "Email ou senha incorretos" });
      }

      // Gera token JWT válido por 1 hora
      const token = jwt.sign(
        { id_usuario: voluntario.id_usuario, email: voluntario.email },
        SECRET,
        { expiresIn: "1h" }
      );

      // Retorna no formato que o front espera
      return res.status(200).json({
        auth: true,
        token,
        usuario: {
          id_usuario: voluntario.id_usuario,
          nome: voluntario.nome,
          avatarUrl: voluntario.avatarUrl || ""
        }
      });

    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ auth: false, message: "Erro ao tentar logar" });
    }
  }
}
