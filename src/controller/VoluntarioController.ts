import { Request, Response } from "express";
import { Voluntario } from "../model/Voluntario";

// Define a estrutura de dados esperada para um voluntário
interface VoluntarioDTO {
    cpf: string;
    nome: string;
    sobrenome: string;
    data_nascimento: Date;
    endereco: string;
    email: string;
    telefone: string;
}

/**
 * Controlador responsável por gerenciar os voluntários.
 */
export class VoluntarioController {
    /**
     * Lista todos os voluntários cadastrados.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeVoluntarios = await Voluntario.listarVoluntarios();

            if (listaDeVoluntarios) {
                return res.status(200).json(listaDeVoluntarios);
            } else {
                return res.status(400).json({ mensagem: "Erro ao buscar voluntários." });
            }
        } catch (error) {
            console.error("Erro ao acessar listagem de voluntários:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

    /**
     * Cadastra um novo voluntário.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const voluntarioRecebido: VoluntarioDTO = req.body;

            const novoVoluntario = new Voluntario(
                voluntarioRecebido.cpf,
                voluntarioRecebido.nome,
                voluntarioRecebido.sobrenome,
                voluntarioRecebido.data_nascimento,
                voluntarioRecebido.endereco,
                voluntarioRecebido.email,
                voluntarioRecebido.telefone
            );

            const resultado = await Voluntario.cadastroVoluntario(novoVoluntario);

            if (resultado) {
                return res.status(200).json({ mensagem: "Voluntário cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar voluntário." });
            }
        } catch (error) {
            console.error("Erro ao cadastrar voluntário:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }
}