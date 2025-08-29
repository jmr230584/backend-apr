import { Request, Response } from "express";
import { Voluntario } from "../model/Voluntario";

export class AuthController {
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios" });
      }

      // Busca o voluntário pelo email
      const voluntario = await Voluntario.buscarPorEmail(email);
      if (!voluntario) {
        return res.status(401).json({ erro: "Usuário não encontrado" });
      }

      // Verifica a senha (assumindo que você tem um método setSenha / validarSenha)
      const senhaValida = voluntario.validarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: "Senha incorreta" });
      }

      // Se quiser, pode gerar um token JWT aqui (opcional)
      return res.status(200).json({ mensagem: "Login realizado com sucesso", voluntario });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ erro: "Erro ao tentar logar" });
    }
  }
}
