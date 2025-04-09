// Importa os tipos Request e Response do Express para manipular requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a classe Voluntario do modelo correspondente, que contém a lógica de negócio para os voluntários
import { Voluntario } from "../model/Voluntario";

// Define uma interface (DTO - Data Transfer Object) para padronizar os dados esperados ao cadastrar um voluntário
interface VoluntarioDTO {
    idVoluntario: number;
    cpf: string;               // CPF do voluntário (identificação única)
    nome: string;              // Nome do voluntário
    sobrenome: string;         // Sobrenome do voluntário
    data_nascimento: Date;     // Data de nascimento do voluntário
    endereco: string;          // Endereço do voluntário
    email: string;             // E-mail para contato
    telefone: string;          // Telefone de contato
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
            // Chama o método listarVoluntarios() da classe Voluntario para obter a lista de voluntários cadastrados
            const listaDeVoluntarios = await Voluntario.listarVoluntarios();

            if (listaDeVoluntarios) {
                // Retorna a lista de voluntários no formato JSON com status 200 (OK)
                return res.status(200).json(listaDeVoluntarios);
            } else {
                // Caso não haja voluntários cadastrados ou ocorra um erro, retorna um erro 400
                return res.status(400).json({ mensagem: "Erro ao buscar voluntários." });
            }
        } catch (error) {
            // Em caso de erro inesperado, exibe uma mensagem no console e retorna um erro 500 (Erro interno do servidor)
            console.error("Erro ao acessar listagem de voluntários:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

    /**
     * Método assíncrono para cadastrar um novo voluntário.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Obtém os dados do corpo da requisição e os armazena em um objeto do tipo VoluntarioDTO
            const voluntarioRecebido: VoluntarioDTO = req.body;

            // Cria uma nova instância da classe Voluntario com os dados recebidos
            const novoVoluntario = new Voluntario(
                voluntarioRecebido.cpf,                 // CPF do voluntário
                voluntarioRecebido.nome,                // Nome
                voluntarioRecebido.sobrenome,           // Sobrenome
                voluntarioRecebido.data_nascimento = new Date(), // Define a data de nascimento como a data atual
                voluntarioRecebido.endereco,            // Endereço
                voluntarioRecebido.email,               // E-mail de contato
                voluntarioRecebido.telefone             // Telefone de contato
            );

            // Exibe no console os dados do novo voluntário para fins de depuração
            console.log(novoVoluntario);

            // Chama o método cadastroVoluntario() da classe Voluntario para salvar o novo voluntário no banco de dados
            const resultado = await Voluntario.cadastroVoluntario(novoVoluntario);

            if (resultado) {
                // Se o cadastro for bem-sucedido, retorna uma mensagem de sucesso com status 200 (OK)
                return res.status(200).json({ mensagem: "Voluntário cadastrado com sucesso!" });
            } else {
                // Caso ocorra algum erro durante o cadastro, retorna um erro 400 com uma mensagem informativa
                return res.status(400).json({ mensagem: "Erro ao cadastrar voluntário." });
            }
        } catch (error) {
            // Em caso de erro inesperado, exibe uma mensagem no console e retorna um erro 500 (Erro interno do servidor)
            console.error("Erro ao cadastrar voluntário:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
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

            //const idVoluntarioRecebido = parseInt(req.params.idVoluntario as string);

            const VoluntarioAtualizado = new Voluntario(
                VoluntarioRecebido.cpf,
                VoluntarioRecebido.nome, 
                VoluntarioRecebido.sobrenome, 
                VoluntarioRecebido.data_nascimento,
                VoluntarioRecebido.endereco,
                VoluntarioRecebido.email,
                VoluntarioRecebido.telefone
            );
            
            VoluntarioAtualizado.setIdVoluntario(parseInt(req.params.idVoluntario as string));

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
