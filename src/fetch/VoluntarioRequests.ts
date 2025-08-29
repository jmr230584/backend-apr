import { SERVER_CFG } from '../appConfig';
import VoluntarioDTO from '../Interfaces/VoluntarioInterface';

/**
 * Classe com a coleção de funções que farão as requisições à API
 * Esta classe representa apenas as requisições da entidade voluntário
 */
class VoluntarioRequests {
    /**
     * Método que faz uma requisição à API para cadastrar um novo voluntário.
     * Recebe um objeto com os dados do voluntário, envia para o backend no formato JSON.
     * @param dados - Objeto contendo nome, cpf, endereço, email, telefone e data de nascimento.
     * @returns Retorna o JSON da resposta ou null em caso de erro.
     */

    async cadastrarVoluntario(dados: {
        cpf:string;
        nome: string;
        sobrenome: string;
        endereco: string;
        email: string;
        telefone: string;
        dataNascimento: string;
      }) {
        try {
          const respostaAPI = await fetch(`${this.serverURL}${this.routeCadastraVoluntario}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cpf: dados.cpf,
                nome: dados.nome,
                sobrenome: dados.sobrenome,
                endereco: dados.endereco,
                email: dados.email,
                telefone: dados.telefone,
                dataNascimento: dados.dataNascimento,
                statusVoluntario: true
              })
          });
      
          if (!respostaAPI.ok) {
            console.error("Erro ao cadastrar voluntário:", await respostaAPI.text());
            return null;
          }
      
          return await respostaAPI.json();
        } catch (error) {
          console.error("Erro ao cadastrar voluntário:", error);
          return null;
        }
      }
      
    private serverURL: string;             // Variável para o endereço do servidor
    private routeListaVoluntarios: string;    // Rota para listar voluntários
    private routeCadastraVoluntario: string;  // Rota para cadastrar voluntário
    private routeAtualizaVoluntario: string;  // Rota para atualizar voluntário
    private routeRemoveVoluntario: string;    // Rota para remover voluntário

    /**
     * Construtor que inicializa as variáveis com as URLs e rotas da API
     */
    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;              // Endereço do servidor web
        this.routeListaVoluntarios = '/lista/voluntarios';   // Rota para listar voluntários
        this.routeCadastraVoluntario = '/voluntario/novo';   // Rota para cadastro de voluntário
        this.routeAtualizaVoluntario = '/remover/voluntario';// Rota para atualização de voluntário
        this.routeRemoveVoluntario = '/atualizar/voluntario/:idVoluntario'; // Rota para remoção
    }

    /**
     * Método que faz uma requisição para obter a lista de voluntários cadastrados
     * @returns Retorna a lista de voluntários em JSON ou null em caso de erro
     */
    async listarVoluntario(): Promise<VoluntarioDTO | null> {
        try {
            // Faz a requisição no servidor
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaVoluntarios}`);

            // Se a resposta for ok, converte para JSON e retorna
            if (respostaAPI.ok) {
                const listaDeVoluntarios: VoluntarioDTO = await respostaAPI.json();
                return listaDeVoluntarios;
            }

            // Caso contrário, retorna null
            return null;
        } catch (error) {
            // Loga o erro no console e retorna null
            console.error(`Erro ao fazer a consulta de voluntários: ${error}`);
            return null;
        }
    }
}

// Exporta a classe já instanciando um objeto da mesma
export default new VoluntarioRequests();
