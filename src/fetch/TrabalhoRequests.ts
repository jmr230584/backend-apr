// Importa as configurações do servidor a partir de um arquivo externo
import { SERVER_CFG } from "../appConfig";
import TrabalhoDTO from "../Interfaces/TrabalhosInterface";

/**
 * Classe responsável por fazer as requisições relacionadas aos Trabalhos
 * Esta classe irá se comunicar com a API para listar, cadastrar, atualizar e remover Trabalhos
 */
class TrabalhoRequests {

    private serverURL: string;          // URL base do servidor da API
    private routeListaTrabalhos: string;   // Rota (endpoint) para buscar a lista de Trabalhos
    private routeCadastraTrabalho: string; // Rota para cadastrar um novo Trabalho
    private routeAtualizaTrabalho: string; // Rota para atualizar os dados de um Trabalho
    private routeRemoveTrabalho: string;   // Rota para remover um Trabalho

    /**
     * O construtor é chamado automaticamente quando criamos uma nova instância da classe.
     * Ele define os valores iniciais das variáveis com base nas configurações da API.
     */
    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;         // Endereço do servidor web
        this.routeListaTrabalhos = '/lista/trabalho';        // Define a rota para listar os Trabalhos
        this.routeCadastraTrabalho = '/trabalho/novo';        // Define a rota para cadastrar Trabalhos
        this.routeAtualizaTrabalho = '/remover/trabalho';    // Define a rota para atualizar Trabalhos
        this.routeRemoveTrabalho = '/atualizar/trabalho/:idTrabalho';        // Define a rota para remover Trabalhos
    }

    /**
     * Método que faz uma requisição à API para buscar a lista de trabalhos cadastrados
     * @returns Retorna um JSON com a lista de trabalhos ou null em caso de erro
     */
    async listarTrabalhos(): Promise<TrabalhoDTO | null> {
        try {
            // Faz a requisição GET para a rota da lista de trabalhos
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaTrabalhos}`);
        
            // Verifica se a resposta da API foi bem-sucedida (status 200-299)
            if(respostaAPI.ok) {
                // Converte a resposta para formato JSON
                const listaDeTrabalhos: TrabalhoDTO = await respostaAPI.json();

                // Retorna a lista de trabalhos
                return listaDeTrabalhos;
            }

            // retorna um valor nulo caso o servidor não envie a resposta
            return null;
        } catch (error) {
            // Caso ocorra algum erro (ex: servidor fora do ar), exibe no console
            console.error(`Erro ao fazer a consulta de trabalhos: ${error}`);

            // Retorna null para indicar que a operação falhou
            return null;
        }
    }
}

// Exporta a classe já com um objeto instanciado para ser usado diretamente
export default new TrabalhoRequests();