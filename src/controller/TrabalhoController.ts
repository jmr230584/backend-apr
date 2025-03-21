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
            const listaDeTrabalhos = await Trabalho.listagemTrabalhos();

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
                trabalhoRecebido.dataInicio = new Date(),  // Define a data de início como a data atual
                trabalhoRecebido.dataTermino = new Date(), // Define a data de término como a data atual
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
}
