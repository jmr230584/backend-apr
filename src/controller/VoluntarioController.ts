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

    
    /**
     * Processa a requisição para cadastro de um novo voluntario.
     * 
     * Esta função extrai os dados do voluntario enviados no corpo da requisição e cria um objeto `Voluntario` com essas informações.
     * Em seguida, chama o método `cadastroVoluntario` para inserir o voluntario no banco de dados. A função retorna uma resposta JSON 
     * indicando sucesso ou falha no cadastro, conforme o resultado da operação.
     * 
     * @param {Request} req - Objeto de requisição do Express, que contém os dados do voluntario no corpo (`body`).
     * @param {Response} res - Objeto de resposta do Express, usado para enviar a resposta HTTP de volta ao voluntario.
     * 
     * @returns {Promise<Response>} - Resposta HTTP JSON com uma mensagem de sucesso ou erro.
     * 
     * @throws {Error} - Em caso de erro, registra a mensagem no console e retorna um status 400 com uma mensagem JSON.
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface TrabalhoDTO
            const voluntarioRecebido: VoluntarioDTO = req.body;

            // instanciando um objeto do tipo carro com as informações recebidas
            const novoVoluntario = new Voluntario (voluntarioRecebido.cpf, voluntarioRecebido.nome, voluntarioRecebido.sobrenome,
                voluntarioRecebido.data_nascimento, voluntarioRecebido.endereco, voluntarioRecebido.email, voluntarioRecebido.telefone);

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await Voluntario.cadastroVoluntario(novoVoluntario);

            // verifica a resposta da função
            if(repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Novo voluntário cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastra o voluntário. Entre em contato com o administrador do sistema."})
            } 
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar o voluntário. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o usuário. Entre em contato com o administrador do sistema." });
        }
    }
}