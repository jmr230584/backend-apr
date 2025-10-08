import { Request, Response } from "express";
import { ParticipacaoTrabalho, Participacao} from '../model/Participacao';

interface ParticipacaoDTO {
    idParticipacao: number;
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
      * Atualiza as informações de uma participação existente.
      *
      * @param req - Objeto de solicitação HTTP, contendo os dados do voluntário no corpo da solicitação e o ID da participação nos parâmetros.
      * @param res - Objeto de resposta HTTP.
      * @returns Uma promessa que resolve com uma resposta HTTP indicando o sucesso ou falha da operação.
      *
      * @throws Retorna uma resposta HTTP com status 400 e uma mensagem de erro se ocorrer um problema durante a atualização da participação.
      */
 static async atualizar(req: Request, res: Response): Promise<any> {
    try {
        const ParticipacaoRecebido: ParticipacaoDTO = req.body;
        const idParticipacaoRecebido = parseInt(req.params.idParticipacao as string);

        const ParticipacaoAtualizado = new ParticipacaoTrabalho(
            idParticipacaoRecebido, 
            ParticipacaoRecebido.idTrabalho,
            ParticipacaoRecebido.idVoluntario,
            ParticipacaoRecebido.quantidadeVagas,
            ParticipacaoRecebido.duracao,
            ParticipacaoRecebido.atividadeTrabalho
        );

        const respostaModelo = await ParticipacaoTrabalho.atualizarParticipacao(ParticipacaoAtualizado);

        if(respostaModelo) {
            return res.status(200).json({ mensagem: "Participação atualizada com sucesso!" });
        } else {
            return res.status(400).json({ mensagem: "Não foi possível atualizar a participação." });
        }
    } catch (error) {
        console.error(`Erro ao atualizar a participação: ${error}`);
        return res.status(500).json({ mensagem: "Erro interno ao atualizar participação." });
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

export default ParticipacaoController;