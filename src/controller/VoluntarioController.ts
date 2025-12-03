// VoluntarioController.ts
import { Request, Response } from "express";
import { Voluntario } from "../model/Voluntario";
import path from "path";
import * as fs from "fs";

// Interface pra padronizar os dados que chegam
interface VoluntarioDTO {
    idVoluntario: number;
    cpf: string;
    nome: string;
    sobrenome: string;
    dataNascimento: Date;
    endereco: string;
    email: string;
    telefone: string;
    senha: string;
    imagemPerfil: string;
}

export class VoluntarioController {

    // Lista todos os voluntários
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeVoluntarios = await Voluntario.listarVoluntarios();
            res.status(200).json(listaDeVoluntarios);
        } catch (error) {
            console.error(`Erro ao acessar método herdado: ${error}`);
            res.status(400).json("Erro ao recuperar as informações do voluntário");
        }
    }

    // Cadastra um novo voluntário
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: VoluntarioDTO = req.body;

            const novoVoluntario = new Voluntario(
                dadosRecebidos.cpf,
                dadosRecebidos.nome,
                dadosRecebidos.sobrenome,
                dadosRecebidos.dataNascimento,
                dadosRecebidos.endereco,
                dadosRecebidos.email,
                dadosRecebidos.telefone,
                dadosRecebidos.imagemPerfil
            );

            // Criptografa a senha antes de salvar
            await novoVoluntario.setSenha(dadosRecebidos.senha);

            const uuid = await Voluntario.cadastroVoluntario(novoVoluntario);
            if (!uuid) return res.status(500).json({ erro: 'Erro ao cadastrar voluntário' });

            // Se tiver imagem de perfil
            if (req.file) {
                const ext = path.extname(req.file.originalname);
                const novoNome = `${uuid}${ext}`;
                const antigoPath = req.file.path;
                const novoPath = path.resolve(req.file.destination, novoNome);

                fs.renameSync(antigoPath, novoPath);
                await Voluntario.atualizarImagemPerfil(uuid, novoNome);
            }

            return res.status(201).json({ mensagem: 'Voluntário cadastrado com sucesso' });
        } catch (error) {
            console.error('Erro ao cadastrar Voluntário:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar Voluntário', detalhes: error });
        }
    }

    // Remove voluntário
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idVoluntario = parseInt(req.query.idVoluntario as string);
            const result = await Voluntario.removerVoluntario(idVoluntario);

            if (result) return res.status(200).json('Voluntário removido com sucesso');
            return res.status(401).json('Erro ao deletar Voluntário');
        } catch (error) {
            console.error("Erro ao remover o Voluntário:", error);
            return res.status(500).send("error");
        }
    }

    // Atualiza voluntário
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: VoluntarioDTO = req.body;
            const idVoluntario = parseInt(req.params.idVoluntario as string);

            const voluntarioAtualizado = new Voluntario(
                dadosRecebidos.cpf,
                dadosRecebidos.nome,
                dadosRecebidos.sobrenome,
                dadosRecebidos.dataNascimento,
                dadosRecebidos.endereco,
                dadosRecebidos.email,
                dadosRecebidos.telefone,
                dadosRecebidos.imagemPerfil
            );

            voluntarioAtualizado.setIdVoluntario(idVoluntario);

            // Se enviar nova senha, criptografa
            if (dadosRecebidos.senha) {
                await voluntarioAtualizado.setSenha(dadosRecebidos.senha);
            }

            const respostaModelo = await Voluntario.atualizarVoluntario(voluntarioAtualizado);

            if (respostaModelo) return res.status(200).json({ mensagem: "Voluntário atualizado com sucesso!" });
            return res.status(400).json({ mensagem: "Não foi possível atualizar o voluntário." });

        } catch (error) {
            console.error(`Erro ao atualizar o voluntário: ${error}`);
            return res.status(400).json({ mensagem: "Não foi possível atualizar o voluntário." });
        }
    }

    // Busca um único voluntário pelo ID
static async umVoluntario(req: Request, res: Response): Promise<any> {
    try {
        const idVoluntario = parseInt(req.params.idVoluntario as string);

        const voluntario = await Voluntario.buscarVoluntarioPorId(idVoluntario);

        if (!voluntario) {
            return res.status(404).json({ mensagem: "Voluntário não encontrado" });
        }

        return res.status(200).json(voluntario);

    } catch (error) {
        console.error("Erro ao buscar voluntário:", error);
        return res.status(500).json({ mensagem: "Erro interno ao buscar voluntário" });
    }
}


}

export default VoluntarioController;