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
    
    static async todos(_req: Request, res: Response): Promise<any> {
        try {
            const participacoes = await ParticipacaoTrabalho.listarParticipacao();
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
    
    /**
     * Método para atualizar uma participação existente.
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const idParticipacao = parseInt(req.query.idParticipacao as string);
            const { idTrabalho, idVoluntario, quantidadeVagas, duracao, atividadeTrabalho } = req.body;

            const atualizado = await ParticipacaoTrabalho.atualizarParticipacao(
                idParticipacao, idTrabalho, idVoluntario, quantidadeVagas, duracao, atividadeTrabalho
            );

            if (atualizado) {
                return res.status(200).json({ mensagem: "Participação atualizada com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao atualizar participação." });
            }
        } catch (error) {
            console.error("Erro ao atualizar participação:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

    /**
     * Método para remover uma participação pelo ID.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idParticipacao = parseInt(req.query.idParticipacao as string);
            const result = await ParticipacaoTrabalho.removerParticipacao(idParticipacao);
            
            if (result) {
                return res.status(200).json({ mensagem: "Participação removida com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao remover participação." });
            }
        } catch (error) {
            console.error("Erro ao remover participação:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }
}
