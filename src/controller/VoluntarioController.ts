// Importa os tipos Request e Response do Express para manipular requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a classe Voluntario do modelo correspondente, que contém a lógica de negócio para os voluntários
import { Voluntario } from "../model/Voluntario";

// Define uma interface (DTO - Data Transfer Object) para padronizar os dados esperados ao cadastrar um voluntário
interface VoluntarioDTO {
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
}
