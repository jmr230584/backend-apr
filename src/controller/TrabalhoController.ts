// Importa os tipos Request e Response do Express para lidar com as requisições e respostas HTTP
import { Request, Response } from "express"; // Importa os tipos Request e Response do Express


// Importa a classe trabalho do modelo correspondente
import { Trabalho } from "../model/Trabalho"; // Importa a classe Trabalho do modelo correspondente

// Define uma interface para estruturar os dados do trabalho voluntário
interface TrabalhoDTO {

    nomeTrabalho: string; 
    ongResponsavel: string;
    localizacao: string;
    dataInicio: Date;
    dataTermino: Date;
}

/**
 * Controlador responsável por gerenciar os trabalhos voluntários.
 * Estende a classe Trabalho para utilizar seus métodos estáticos.
 */
export class TrabalhoController extends Trabalho {
    /**
     * Lista todos os trabalhos cadastrados.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de trabalhos em formato JSON com status 200 em caso de sucesso.
     * @throws Retorna o status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de alunos.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Chama o método listarTrabalhos da classe Trabalho para obter a lista de trabalhos
            const listaDeTrabalhos = await Trabalho.listagemTrabalhos();

            return res.status(200).json(listaDeTrabalhos); // Retorna a lista com status 200

        } catch (error) {
            console.log("Erro ao acessar listagem de trabalhos"); // Log do erro no console

            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de trabalhos" }); // Retorna erro com status 400
        }
    }

}
