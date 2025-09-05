// Importa os tipos Request e Response do Express para manipular requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a classe Voluntario do modelo correspondente, que contém a lógica de negócio para os voluntários
import { Voluntario } from "../model/Voluntario";

import path from "path";
import * as fs from "fs";


// Define uma interface (DTO - Data Transfer Object) para padronizar os dados esperados ao cadastrar um voluntário
interface VoluntarioDTO {
    idVoluntario: number;
    cpf: string;               // CPF do voluntário (identificação única)
    nome: string;              // Nome do voluntário
    sobrenome: string;         // Sobrenome do voluntário
    dataNascimento: Date;     // Data de nascimento do voluntário
    endereco: string;          // Endereço do voluntário
    email: string;             // E-mail para contato e usuário
    telefone: string;          // Telefone de contato
    senha: string;             // senha para logar
    imagemPerfil: string;    // foto de perfil do voluntário
}

/**
 * Controlador responsável por gerenciar os voluntários.
 */
export class VoluntarioController {

    /**
     * Método assíncrono que lista todos os voluntários cadastrados.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeVoluntarios = await Voluntario.listarVoluntarios();

            res.status(200).json(listaDeVoluntarios);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);

            res.status(400).json("Erro ao recuperar as informações do voluntário");
        }
    }

    /**
    * Método assíncrono para cadastrar um novo voluntário.
    */
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            // Extrai os dados do corpo da requisição
            const dadosRecebidos: VoluntarioDTO = req.body;

            // Instancia um novo objeto de voluntário com os dados recebidos
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

            // Define a senha do voluntário (armazenada de forma segura no modelo)
            novoVoluntario.setSenha(dadosRecebidos.senha);

            // Cadastra o voluntário no banco de dados e obtém seu UUID
            const uuid = await Voluntario.cadastroVoluntario(novoVoluntario);

            // Se não foi possível cadastrar, retorna erro
            if (!uuid) {
                return res.status(500).json({ erro: 'Erro ao cadastrar voluntário' });
            }

            // Se uma imagem de perfil foi enviada, renomeia e atualiza o nome no banco
            if (req.file) {
                const ext = path.extname(req.file.originalname); // Pega a extensão original do arquivo
                const novoNome = `${uuid}${ext}`; // Define o novo nome do arquivo como o UUID do usuário
                const antigoPath = req.file.path; // Caminho temporário do upload
                const novoPath = path.resolve(req.file.destination, novoNome); // Caminho de destino final

                fs.renameSync(antigoPath, novoPath); // Renomeia o arquivo no sistema de arquivos

                await Voluntario.atualizarImagemPerfil(uuid, novoNome); // Atualiza o nome do arquivo no banco de dados
            }

            // Retorna sucesso
            return res.status(201).json({ mensagem: 'Voluntário cadastrado com sucesso' });
        } catch (error) {
            // Em caso de erro, registra nos logs e retorna erro para o cliente
            console.error('Erro ao cadastrar Voluntário:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar Voluntário', detalhes: error });
        }
    }

   /**
     * Remove um voluntario.
     * @param req Objeto de requisição HTTP com o ID do voluntario a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
           const idVoluntario = parseInt(req.query.idVoluntario as string);
           const result = await Voluntario.removerVoluntario(idVoluntario);
        
           if (result) {
             return res.status(200).json('Voluntário removido com sucesso');
            } else {
                return res.status(401).json('Erro ao deletar Voluntário');
            }

        } catch (error) {
            console.log("Erro ao remover o Voluntário");
            console.log(error);
            return res.status(500).send("error");
        }
    }

    
    /**
     * Atualiza as informações de um voluntário existente.
     *
     * @param req - Objeto de solicitação HTTP, contendo os dados do voluntário no corpo da solicitação e o ID do voluntário nos parâmetros.
     * @param res - Objeto de resposta HTTP.
     * @returns Uma promessa que resolve com uma resposta HTTP indicando o sucesso ou falha da operação.
     *
     * @throws Retorna uma resposta HTTP com status 400 e uma mensagem de erro se ocorrer um problema durante a atualização do voluntário.
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const VoluntarioRecebido: VoluntarioDTO = req.body;

            const idVoluntarioRecebido = parseInt(req.params.idVoluntario as string);
            console.log(idVoluntarioRecebido);

            const VoluntarioAtualizado = new Voluntario(
                VoluntarioRecebido.cpf,
                VoluntarioRecebido.nome, 
                VoluntarioRecebido.sobrenome, 
                VoluntarioRecebido.dataNascimento,
                VoluntarioRecebido.endereco,
                VoluntarioRecebido.email,
                VoluntarioRecebido.telefone,
                VoluntarioRecebido.imagemPerfil
            );

            
            
            VoluntarioAtualizado.setIdVoluntario(idVoluntarioRecebido);

            const respostaModelo = await Voluntario.atualizarVoluntario(VoluntarioAtualizado);

            console.log(VoluntarioAtualizado);

            if(respostaModelo) {
                return res.status(200).json({ mensagem: "Voluntário atualizado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível atualizar o voluntário. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log(`Erro ao remover o aluno. ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível atualizar o voluntário. Entre em contato com o administrador do sistema." });
        }
    }
}

export default VoluntarioController;
