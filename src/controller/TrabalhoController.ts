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


    /**
    * Método controller para cadastrar um novo trabalho.
    * 
    * Esta função recebe uma requisição HTTP contendo os dados de um trabalho no corpo da requisição
    * e tenta cadastrar este carro no banco de dados utilizando a função `cadastroTrabalho`. Caso o cadastro 
    * seja bem-sucedido, retorna uma resposta HTTP 200 com uma mensagem de sucesso. Caso contrário, retorna
    * uma resposta HTTP 400 com uma mensagem de erro.
    * 
    * @param {Request} req - Objeto de requisição HTTP, contendo o corpo com os dados do trabalho no formato `TrabalhoDTO`.
    * @param {Response} res - Objeto de resposta HTTP usado para retornar o status e a mensagem a pessoa.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com o status 200 em caso de sucesso, ou 400 em caso de erro.
    * 
    * @throws {Error} - Se ocorrer um erro durante o processo de cadastro, uma mensagem é exibida no console e uma 
    *                   resposta HTTP 400 com uma mensagem de erro é enviada ao cliente.
    */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface CarroDTO
            const trabalhoRecebido: TrabalhoDTO = req.body;

            // instanciando um objeto do tipo carro com as informações recebidas
            const novoTrabalho = new Trabalho(trabalhoRecebido.nomeTrabalho, 
                                        trabalhoRecebido.ongResponsavel, 
                                        trabalhoRecebido.localizacao, 
                                        trabalhoRecebido.dataInicio,
                                        trabalhoRecebido.dataTermino);

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await Trabalho.cadastroTrabalho(novoTrabalho);

            // verifica a resposta da função
            if(repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Trabalho cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastra o trabalho. Entre em contato com o administrador do sistema."})
            }
        
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar um trabalho. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o trabalho. Entre em contato com o administrador do sistema." });
        }
    }
}
