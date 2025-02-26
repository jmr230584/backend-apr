import { Request, Response } from "express";
import { Voluntario } from "../model/Voluntario";

// Define a estrutura de dados esperada para um voluntário
interface VoluntarioDTO {
    cpf: string;
    nome: string;
    sobrenome: string;
    data_nascimento: Date;
    endereco: string; 
    email: string;
    telefone: string;
}
/**
 * Controlador responsável por gerenciar os voluntários.
 */
export class VoluntarioController {
    /**
     * Lista todos os voluntários cadastrados.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de voluntários em formato JSON com status 200 em caso de sucesso.
     * @throws Retorna o status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de voluntários.
     */
    static async listarTodos(req: Request, res: Response): Promise<any> {
        try {
            // Simulação de uma função que busca a lista de voluntários 
            const listaDeVoluntarios: VoluntarioDTO[] = await this.listaDeVoluntarios();

            return res.status(200).json(listaDeVoluntarios); // Retorna a lista com status 200

        } catch (error) {
            console.error("Erro ao acessar listagem de voluntários:", error); // Log do erro no console

            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de voluntários" }); // Retorna erro com status 400
        }
    }
    static listaDeVoluntarios(): VoluntarioDTO[] | PromiseLike<VoluntarioDTO[]> {
        throw new Error("Method not implemented.");
    }
}