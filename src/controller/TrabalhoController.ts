import { Request, Response } from "express";
import { Trabalho } from "../model/Trabalho";

// Define a estrutura de dados esperada para um trabalho
interface TrabalhoDTO {
    nome_trabalho: string;
    ong_responsavel: string;
    localizacao: string;
    dataInicio: Date;
    dataTermino: Date;
}

/**
 * Controlador responsável por gerenciar os trabalhos.
 */
export class TrabalhoController {
    /**
     * Lista todos os trabalhos cadastrados.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeTrabalhos = await Trabalho.listagemTrabalhos();

            if (listaDeTrabalhos) {
                return res.status(200).json(listaDeTrabalhos);
            } else {
                return res.status(400).json({ mensagem: "Erro ao buscar trabalhos." });
            }
        } catch (error) {
            console.error("Erro ao acessar listagem de trabalhos:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

    /**
     * Cadastra um novo trabalho.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const trabalhoRecebido: TrabalhoDTO = req.body;

            const novoTrabalho = new Trabalho(
                trabalhoRecebido.nome_trabalho,
                trabalhoRecebido.ong_responsavel,
                trabalhoRecebido.localizacao,
                trabalhoRecebido.dataInicio = new Date(),
                trabalhoRecebido.dataTermino = new Date()
            );

            const resultado = await Trabalho.cadastroTrabalho(novoTrabalho);

            if (resultado) {
                return res.status(200).json({ mensagem: "Trabalho cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar trabalho." });
            }
        } catch (error) {
            console.error("Erro ao cadastrar trabalho:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }
}