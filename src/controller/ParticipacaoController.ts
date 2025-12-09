import { Request, Response } from "express";
import { ParticipacaoTrabalho } from "../model/Participacao";

export class ParticipacaoController {

    static async todos(_req: Request, res: Response): Promise<any> {
        try {
            const lista = await ParticipacaoTrabalho.listarParticipacao();
            return res.status(200).json(lista);
        } catch (error) {
            console.error("Erro ao listar participações:", error);
            return res.status(500).json({ erro: "Erro ao listar participações" });
        }
    }


    static async umParticipacao(req: Request, res: Response): Promise<any> {
        try {
            const id = Number(req.params.idParticipacao);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "ID inválido" });
            }

            const participacao = await ParticipacaoTrabalho.listar(id);
            if (!participacao) {
                return res.status(404).json({ erro: "Participação não encontrada" });
            }

            return res.status(200).json(participacao);

        } catch (error) {
            console.error("Erro ao buscar participação:", error);
            return res.status(500).json({ erro: "Erro ao buscar participação" });
        }
    }

    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const { idTrabalho, idVoluntario, quantidadeVagas, duracao, atividadeTrabalho } = req.body;

            const criada = await ParticipacaoTrabalho.cadastrarParticipacao(
                idTrabalho,
                idVoluntario,
                quantidadeVagas,
                duracao,
                atividadeTrabalho
            );

            if (!criada) {
                return res.status(500).json({ erro: "Erro ao cadastrar participação" });
            }

            return res.status(201).json({ mensagem: "Participação cadastrada com sucesso" });

        } catch (error) {
            console.error("Erro ao cadastrar participação:", error);
            return res.status(500).json({ erro: "Erro ao cadastrar participação" });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const id = Number(req.params.idParticipacao);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "ID inválido" });
            }

            const dados = req.body;

            // Buscar antes de atualizar
            const existente = await ParticipacaoTrabalho.listar(id);
            if (!existente) {
                return res.status(404).json({ erro: "Participação não encontrada" });
            }

            // Atualizar via setters
            existente.setIdTrabalho(dados.idTrabalho);
            existente.setIdVoluntario(dados.idVoluntario);
            existente.setQuantidadeVagas(dados.quantidadeVagas);
            existente.setDuracao(dados.duracao);
            existente.setAtividadeTrabalho(dados.atividadeTrabalho);

            const ok = await ParticipacaoTrabalho.atualizarParticipacao(existente);

            if (!ok) {
                return res.status(500).json({ erro: "Erro ao atualizar participação" });
            }

            return res.status(200).json({ mensagem: "Participação atualizada com sucesso" });

        } catch (error) {
            console.error("Erro ao atualizar participação:", error);
            return res.status(500).json({ erro: "Erro ao atualizar participação" });
        }
    }

    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const { idParticipacao } = req.body;

            if (!idParticipacao) {
                return res.status(400).json({ erro: "Informe o idParticipacao" });
            }

            const removido = await ParticipacaoTrabalho.removerParticipacao(idParticipacao);

            if (!removido) {
                return res.status(404).json({ erro: "Participação não encontrada" });
            }

            return res.status(200).json({ mensagem: "Participação removida com sucesso" });

        } catch (error) {
            console.error("Erro ao remover participação:", error);
            return res.status(500).json({ erro: "Erro ao remover participação" });
        }
    }
}
