// Importa os tipos Request e Response do Express para lidar com as requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a classe ParticipacaoTrabalho do modelo correspondente, que contém a lógica de negócio relacionada à participação
import { ParticipacaoTrabalho } from "../model/Participacao";

// Define uma interface (DTO - Data Transfer Object) para padronizar os dados que serão recebidos no corpo da requisição
interface ParticipacaoDTO {
    idTrabalho: number;       // Identificador do trabalho ao qual a participação está relacionada
    idVoluntario: number;     // Identificador do voluntário que está participando
    quantidadeVagas: number;  // Quantidade de vagas disponíveis para essa participação
    duracao: string;          // Duração da participação na atividade
    atividadeTrabalho: string; // Descrição da atividade a ser realizada
}

// Define a classe ParticipacaoController, que gerencia as requisições relacionadas à participação
// Essa classe herda de ParticipacaoTrabalho, podendo utilizar seus métodos
export class ParticipacaoController extends ParticipacaoTrabalho {
    
    // Método assíncrono para listar todas as participações cadastradas
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Chama o método listarParticipacao() da classe ParticipacaoTrabalho para obter a lista de participações
            const listaDeParticipacao = await ParticipacaoTrabalho.listarParticipacao();

            // Retorna a lista de participações no formato JSON com status 200 (OK)
            return res.status(200).json(listaDeParticipacao);
        } catch (error) {
            // Caso ocorra um erro, exibe uma mensagem no console
            console.log("Erro ao acessar listagem de Participação");

            // Retorna um erro 400 (Bad Request) com uma mensagem informativa
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de Participação" });
        }
    }

    // Método assíncrono para cadastrar uma nova participação
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Obtém os dados do corpo da requisição e os armazena em um objeto do tipo ParticipacaoDTO
            const ParticipacaoRecebido: ParticipacaoDTO = req.body;

            // Chama o método cadastroParticipacao() da classe ParticipacaoTrabalho para registrar a nova participação
            const respostaClasse = await ParticipacaoTrabalho.cadastroParticipacao(
                ParticipacaoRecebido.idTrabalho,
                ParticipacaoRecebido.idVoluntario,
                ParticipacaoRecebido.quantidadeVagas,
                ParticipacaoRecebido.duracao,
                ParticipacaoRecebido.atividadeTrabalho
            );

            if (respostaClasse) {
                // Se o cadastro for bem-sucedido, retorna uma mensagem de sucesso com status 200 (OK)
                return res.status(200).json({ mensagem: "Participação cadastrada com sucesso!" });
            } else {
                // Se ocorrer algum problema no cadastro, retorna um erro 400 com uma mensagem explicativa
                return res.status(400).json({ mensagem: "Erro ao cadastrar a Participação. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // Exibe uma mensagem de erro no console
            console.log(`Erro ao cadastrar a Participação: ${error}`);

            // Retorna um erro 400 com uma mensagem informativa para o usuário
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a Participação. Entre em contato com o administrador do sistema." });
        }
    }    
}
