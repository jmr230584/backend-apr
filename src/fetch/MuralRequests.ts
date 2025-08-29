// Importa as configurações do servidor a partir de um arquivo externo
import { SERVER_CFG } from "../appConfig";
import MuralTrabalhosDTO from "../Interfaces/MuralInterface";

/**
 * Classe responsável por fazer as requisições relacionadas aos Trabalhos
 * Esta classe irá se comunicar com a API para listar, cadastrar, atualizar e remover Trabalhos
 */
class MuralTrabalhosRequests {

    private serverURL: string;          // URL base do servidor da API
    private routeListaMuralTrabalhos: string;   // Rota (endpoint) para buscar a lista de Trabalhos
    private routeCadastraMuralTrabalho: string; // Rota para cadastrar um novo Trabalho
    private routeAtualizaMuralTrabalho: string; // Rota para atualizar os dados de um Trabalho
    private routeRemoveMuralTrabalho: string;   // Rota para remover um Trabalho

    /**
     * O construtor é chamado automaticamente quando criamos uma nova instância da classe.
     * Ele define os valores iniciais das variáveis com base nas configurações da API.
     */
    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;         // Endereço do servidor web
        this.routeListaMuralTrabalhos = '/lista/trabalhos';        // Define a rota para listar os Trabalhos no mural
        this.routeCadastraMuralTrabalho = '/trabalhoMural/novo';        // Define a rota para cadastrar Trabalhos no mural
        this.routeAtualizaMuralTrabalho = '/remover/trabalhoMural';    // Define a rota para atualizar Trabalhos no mural
        this.routeRemoveMuralTrabalho = '/atualizar/muraltrabalho/:idMuralTrabalhos';        // Define a rota para remover Trabalhos no mural
    }

    /**
     * Método que faz uma requisição à API para buscar a trabalhos de trabalhos cadastrados
     * @returns Retorna um JSON com a lista de trabalhos ou null em caso de erro
     */
    async listarMuralTrabalhos(): Promise<MuralTrabalhosDTO | null> {
        try {
            // Faz a requisição GET para a rota da lista de trabalhos
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaMuralTrabalhos}`);
        
            // Verifica se a resposta da API foi bem-sucedida (status 200-299)
            if(respostaAPI.ok) {
                // Converte a resposta para formato JSON
                const listaDeMuralTrabalhos: MuralTrabalhosDTO = await respostaAPI.json();

                // Retorna a lista de trabalhos do mural
                return listaDeMuralTrabalhos;
            }

            // retorna um valor nulo caso o servidor não envie a resposta
            return null;
        } catch (error) {
            // Caso ocorra algum erro (ex: servidor fora do ar), exibe no console
            console.error(`Erro ao fazer a consulta dos trabalhos do mural: ${error}`);

            // Retorna null para indicar que a operação falhou
            return null;
        }
    }
}

// Exporta a classe já com um objeto instanciado para ser usado diretamente
export default new MuralTrabalhosRequests();