// Importa os tipos Request e Response do Express para manipular requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a classe muralTrabalhos do modelo correspondente, que contém a lógica de negócio para o Mural.
import { MuralTrabalhos } from "../model/MuralTrabalhos";

// Define uma interface (DTO - Data Transfer Object) para padronizar os dados esperados ao cadastrar um voluntário
interface MuralTrabalhosDTO {
    idMuralTrabalhos: number;
    nomeTrabalho: string;               // nome do trabalho do mural (identificação única)
    ongResponsavel: string;              // ong responsável do trabalho
    totalVoluntarios: number;         //  total de voluntários no trabalho
    dataEncerramento: Date;     // Data de encerramento do trabalho

}

/**
 * Controlador responsável por gerenciar o mural.
 */
export class MuralTrabalhosController {

/**
 * Método assíncrono que lista todos os trabalhos cadastrados no mural.
 */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Chama o método listagemTrabalhosMural() da classe Trabalho para obter a lista de trabalhos
            const listaDeTrabalhosMural = await MuralTrabalhos.listarTrabalhosMural();

            if (listaDeTrabalhosMural) {
                // Retorna a lista de trabalhos no formato JSON com status 200 (OK)
                return res.status(200).json(listaDeTrabalhosMural);
            } else {
                // Caso não haja trabalhos cadastrados ou ocorra um erro, retorna um erro 400
                return res.status(400).json({ mensagem: "Erro ao buscar trabalhos." });
            }
        } catch (error) {
            // Em caso de erro inesperado, exibe uma mensagem no console e retorna um erro 500 (Erro interno do servidor)
            console.error("Erro ao acessar listagem do mural:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

/**
     * Método assíncrono para cadastrar um novo trabalho ao mural.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Obtém os dados do corpo da requisição e os armazena em um objeto do tipo MuralTrabalhosDTO
            const trabalhoRecebido: MuralTrabalhosDTO = req.body;

            // Cria uma nova instância da classe MuralTrabalhos com os dados recebidos
            const novoTrabalho = new MuralTrabalhos(
                trabalhoRecebido.nomeTrabalho,
                trabalhoRecebido.ongResponsavel,
                trabalhoRecebido.totalVoluntarios,
                trabalhoRecebido.dataEncerramento = new Date()
            );

            // Chama o método cadastroTrabalho() da classe Trabalho para salvar o novo trabalho no banco de dados
            const resultado = await MuralTrabalhos.novoTrabalhoMural(novoTrabalho);

            if (resultado) {
                // Se o cadastro for bem-sucedido, retorna uma mensagem de sucesso com status 200 (OK)
                return res.status(200).json({ mensagem: "Trabalho cadastrado com sucesso!" });
            } else {
                // Caso ocorra algum erro durante o cadastro, retorna um erro 400 com uma mensagem informativa
                return res.status(400).json({ mensagem: "Erro ao cadastrar trabalho." });
            }
        } catch (error) {
            // Em caso de erro inesperado, exibe uma mensagem no console e retorna um erro 500 (Erro interno do servidor)
            console.error("Erro ao cadastrar trabalho:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

      /**
     * Remove um trabalho.
     * @param req Objeto de requisição HTTP com o ID do trabalho a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idMuralTrabalhos= parseInt(req.query.idMuralTrabalhos as string);
            const result = await MuralTrabalhos.removerTrabalhoMural(idMuralTrabalhos);
            
            if (result) {
                return res.status(200).json('Trabalho removido com sucesso do mural');
            } else {
                return res.status(401).json('Erro ao deletar trabalho');
            }
        } catch (error) {
            console.log("Erro ao remover o trabalho");
            console.log(error);
            return res.status(500).send("error");
        }
    }
    
        /**
     * Método para atualizar o cadastro de um trabalho no mural.
     * 
     * @param req Objeto de requisição do Express, contendo os dados atualizados do aluno
     * @param res Objeto de resposta do Express
     * @returns Retorna uma resposta HTTP indicando sucesso ou falha na atualização
     */
   static async atualizar(req: Request, res: Response): Promise<any> {
        try{
            const muralRecebido: MuralTrabalhosDTO = req.body;

            const idDadosRecebidos = parseInt(req.params.idMuralTrabalhos as string);

            const muralAtualizado = new MuralTrabalhos (
                muralRecebido.nomeTrabalho,
                muralRecebido.ongResponsavel,
                muralRecebido.totalVoluntarios,
                muralRecebido.dataEncerramento
            );

            muralAtualizado.setIdMuralTrabalhos(idDadosRecebidos);

            const respostaModelo = await MuralTrabalhos.atualizarMuralTrabalho(muralAtualizado);

            if(respostaModelo) {
                return res.status(200).json({mensagem: "O mural foi atualizado com sucesso!"})
            } else{
                return res.status(400).json({ mensagem: "Não foi possível atualizar o mural. Entre em contato com o administrador do sistema." });
            }

        }catch (error) {
            console.log(`Error ao atualizar um trabalho do mural. ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível atualizar o mural. Entre em contato com o administrador do sistema." });
        }
    }
}

export default MuralTrabalhosController;

