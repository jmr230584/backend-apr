import { Request, Response } from "express";
import { ParticipacaoTrabalho } from "../model/Participacao";

interface ParticipacaoDTO {
    idTrabalho: number;
    idVoluntario: number;
    quantidadeVagas: number;
    duracao: string;
    atividadeTrabalho: string;
}

export class ParticipacaoController {
    
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const participacoes = await ParticipacaoTrabalho.listarParticipacoes();
            return res.status(200).json(participacoes);
        } catch (error) {
            console.error("Erro ao listar participações:", error);
            return res.status(500).json({ mensagem: "Erro interno ao listar participações" });
        }
    }

    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const novo: ParticipacaoDTO = req.body;
            
            if (!novo.idTrabalho || !novo.idVoluntario || !novo.quantidadeVagas || 
                !novo.duracao || !novo.atividadeTrabalho) {
                return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
            }

            const sucesso = await ParticipacaoTrabalho.cadastrarParticipacao(
                novo.idTrabalho,
                novo.idVoluntario,
                novo.quantidadeVagas,
                novo.duracao,
                novo.atividadeTrabalho
            );

            if (sucesso) {
                return res.status(201).json({ mensagem: "Participação cadastrada com sucesso" });
            } else {
                return res.status(400).json({ mensagem: "Falha ao cadastrar participação" });
            }
        } catch (error) {
            console.error("Erro ao cadastrar participação:", error);
            return res.status(500).json({ mensagem: "Erro interno ao cadastrar participação" });
        }
    }
}
