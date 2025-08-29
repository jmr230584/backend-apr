// Importa as configurações do servidor (como a URL base da API)
import { SERVER_CFG } from "../appConfig";
import ParticipacaoDTO from "../Interfaces/ParticipacaoInterface";

/**
 * Classe responsável por fazer as requisições da entidade participação.
 * Com essa classe, conseguimos listar, cadastrar, atualizar e remover participação no sistema.
 */
class ParticipacaoRequests {

    private serverURL: string;                  // Variável para o endereço do servidor
    private routeListaParticipacao: string;      // Variável para a rota de listagem de participação
    private routeCadastraParticipacao: string;    // Variável para a rota de cadastro de participação
    private routeAtualizaParticipacao: string;    // Variável para a rota de atualiação de voluntário
    private routeRemoveParticipacao: string;      // Variável para a rota de remoção do voluntário

    /**
     * O construtor é executado automaticamente quando a classe é instanciada.
     * Ele define as rotas e configurações iniciais, com base na configuração do servidor.
     */
    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;               // Endereço do servidor web
        this.routeListaParticipacao = '/lista/participacao';    // Rota para buscar todos os participação
        this.routeCadastraParticipacao = '/participacao/novo';    // Rota para cadastrar um novo participação
        this.routeAtualizaParticipacao = 'atualizar/participacao/:idParticipacao';// Rota para atualizar um participação existente
        this.routeRemoveParticipacao = '/remover/participacao';    // Rota para remover um participação
    }

    /**
     * Método assíncrono que faz uma requisição GET para a API buscando todos os participação cadastrados.
     * @returns Um objeto JSON contendo a lista de participação, ou null em caso de erro
     */
    async listarParticipacao(): Promise<ParticipacaoDTO | null> {
        try {
            // Envia a requisição para a rota de listagem de participação
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaParticipacao}`);

            // Verifica se a resposta foi bem-sucedida (status HTTP 200-299)
            if (respostaAPI.ok) {
                // Converte a resposta em JSON
                const listaDeParticipacao: ParticipacaoDTO = await respostaAPI.json();

                // Retorna a lista obtida
                return listaDeParticipacao;
            }

            // retorna um valor nulo caso o servidor não envie a resposta
            return null;
        } catch (error) {
            // Exibe o erro no console, útil para depuração
            console.error(`Erro ao fazer a consulta de participações: ${error}`);

            // Retorna null em caso de falha
            return null;
        }
    }
}

// Exporta a classe já instanciada, pronta para ser utilizada em outras partes do sistema
export default new ParticipacaoRequests();