// AuthController.ts
import { Request, Response } from "express";
import { Voluntario } from "../model/Voluntario";
import bcrypt from "bcrypt";

export class AuthController {
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios" });
      }

      // busca voluntário só pelo email
      const voluntario = await Voluntario.buscarPorEmail(email);
      if (!voluntario) {
        return res.status(401).json({ erro: "Usuário não encontrado" });
      }

      // compara a senha digitada com a do banco
      const senhaCorreta = await bcrypt.compare(senha, voluntario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: "Senha inválida" });
      }

      return res.status(200).json({ mensagem: "Login realizado com sucesso", voluntario });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ erro: "Erro ao tentar logar" });
    }
  }
}
