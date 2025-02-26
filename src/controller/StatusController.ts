// Importa os tipos Request e Response do Express para lidar com as requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a classe Status do modelo correspondente
import { StatusTrabalho } from "../model/Status";

// Define uma interface para padronizar os dados recebidos no corpo da requisição
interface StatusDTO {
    idTrabalho: number;    
    idVoluntario: number;    
    quantidadeVagas: number; 
    duracao: string;         
    statusTrabalho: string; 
}

// Define a classe StatusController, que estende a classe Status
export class StatusController extends StatusTrabalho {
    
    // Método para listar todos os status cadastrados
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Chama o método listarStatus() da classe Status para obter a lista de status
            const listaDeStatus = await StatusTrabalho.listarStatus();

            // Retorna a lista em formato JSON com status 200 (sucesso)
            return res.status(200).json(listaDeStatus);
        } catch (error) {
            // Em caso de erro, exibe uma mensagem no console
            console.log("Erro ao acessar listagem de status");

            // Retorna um erro 400 (requisição inválida) com uma mensagem de erro
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de status" });
        }
    }
}