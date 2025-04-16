// Importa os tipos Request e Response do Express para manipular requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a classe Trabalho do modelo correspondente, que contém a lógica de negócio para os trabalhos
import { Trabalho } from "../model/Trabalho";

// Define uma interface (DTO - Data Transfer Object) para padronizar os dados esperados ao cadastrar um trabalho
interface TrabalhoDTO { 
    nomeTrabalho: string;      // Nome do trabalho/atividade voluntária
    ongResponsavel: string;    // Nome da ONG responsável pelo trabalho
    localizacao: string;       // Local onde o trabalho será realizado
    dataInicio: Date;          // Data de início do trabalho
    dataTermino: Date;         // Data de término do trabalho
}

/**
 * Controlador responsável por gerenciar os trabalhos voluntários.
 */
export class TrabalhoController {
    
    /**
     * Método assíncrono que lista todos os trabalhos cadastrados.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Chama o método listagemTrabalhos() da classe Trabalho para obter a lista de trabalhos
            const listaDeTrabalhos = await Trabalho.listarTrabalho();

            if (listaDeTrabalhos) {
                // Retorna a lista de trabalhos no formato JSON com status 200 (OK)
                return res.status(200).json(listaDeTrabalhos);
            } else {
                // Caso não haja trabalhos cadastrados ou ocorra um erro, retorna um erro 400
                return res.status(400).json({ mensagem: "Erro ao buscar trabalhos." });
            }
        } catch (error) {
            // Em caso de erro inesperado, exibe uma mensagem no console e retorna um erro 500 (Erro interno do servidor)
            console.error("Erro ao acessar listagem de trabalhos:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

    /**
     * Método assíncrono para cadastrar um novo trabalho.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Obtém os dados do corpo da requisição e os armazena em um objeto do tipo TrabalhoDTO
            const trabalhoRecebido: TrabalhoDTO = req.body;

            // Cria uma nova instância da classe Trabalho com os dados recebidos
            const novoTrabalho = new Trabalho(
                trabalhoRecebido.nomeTrabalho,
                trabalhoRecebido.ongResponsavel,
                trabalhoRecebido.localizacao,
                trabalhoRecebido.dataInicio = new Date(),
                trabalhoRecebido.dataTermino = new Date()
            );

            // Chama o método cadastroTrabalho() da classe Trabalho para salvar o novo trabalho no banco de dados
            const resultado = await Trabalho.cadastroTrabalho(novoTrabalho);

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
            const idTrabalho= parseInt(req.query.idTrabalho as string);
            const result = await Trabalho.removerTrabalho(idTrabalho);
            
            if (result) {
                return res.status(200).json('Trabalho removido com sucesso');
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
     * Atualiza as informações de um trabalho existente.
     *
     * @param req - Objeto de solicitação HTTP, contendo os dados do voluntário no corpo da solicitação e o ID do trabalho nos parâmetros.
     * @param res - Objeto de resposta HTTP.
     * @returns Uma promessa que resolve com uma resposta HTTP indicando o sucesso ou falha da operação.
     *
     * @throws Retorna uma resposta HTTP com status 400 e uma mensagem de erro se ocorrer um problema durante a atualização do trabalho.
     */
     static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const TrabalhoRecebido: TrabalhoDTO = req.body;

            const idTrabalhoRecebido = parseInt(req.params.idTrabalho as string);
            console.log(idTrabalhoRecebido);

            const TrabalhoAtualizado = new Trabalho(
                TrabalhoRecebido.nomeTrabalho,
                TrabalhoRecebido.ongResponsavel,
                TrabalhoRecebido.localizacao,
                TrabalhoRecebido.dataInicio,
                TrabalhoRecebido.dataTermino
            );

            
            TrabalhoAtualizado.setIdTrabalho(idTrabalhoRecebido);

            const respostaModelo = await Trabalho.atualizarTrabalho(TrabalhoAtualizado);

            console.log(TrabalhoAtualizado);

            if(respostaModelo) {
                return res.status(200).json({ mensagem: "Trabalho atualizado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível atualizar o trabalho. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log(`Erro ao remover o trabalho ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível atualizar o trabalho. Entre em contato com o administrador do sistema." });
        }
    }
}
export default TrabalhoController;