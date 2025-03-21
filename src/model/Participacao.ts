// Importa a classe DatabaseModel, responsável por gerenciar a conexão com o banco de dados
import { DatabaseModel } from "./DatabaseModel"; 

// Cria uma instância do DatabaseModel e armazena o pool de conexões para facilitar o acesso ao banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa a Participação de um Trabalho.
 * Responsável por interagir com a tabela "Participacao" no banco de dados.
 */
export class ParticipacaoTrabalho {
    
    /**
     * Método para listar todas as participações cadastradas no banco de dados.
     * @returns Uma lista contendo todas as participações.
     */
    static async listarParticipacao(): Promise<any[]> {
        try {
            // Define a query SQL para selecionar todas as participações registradas
            const query = `SELECT * FROM Participacao`;
            // Executa a consulta no banco de dados
            const resultado = await database.query(query);

            // Retorna as linhas obtidas na consulta
            return resultado.rows;
        } catch (error) {
            // Em caso de erro, exibe a mensagem no console e repassa o erro para tratamento externo
            console.error("Erro ao listar Participacao:", error);
            throw error; 
        }
    }

    /**
     * Método para cadastrar uma nova participação no banco de dados.
     * @param idTrabalho - ID do trabalho ao qual a participação está associada.
     * @param idVoluntario - ID do voluntário que participa do trabalho.
     * @param quantidadeVagas - Quantidade de vagas disponíveis na participação.
     * @param duracao - Duração da participação no trabalho.
     * @param atividadeTrabalho - Descrição da atividade do trabalho.
     * @returns **true** se a inserção foi bem-sucedida, **false** caso contrário.
     */
    static async cadastroParticipacao(idTrabalho: number, idVoluntario: number, quantidadeVagas: number, duracao: string, atividadeTrabalho: string): Promise<boolean> {
        try {
            // Query SQL para inserir os dados da nova participação na tabela Participacao
            const queryInsertParticipacao = `
                INSERT INTO Participacao (id_trabalho, id_voluntario, quantidade_vagas, duracao, atividade_trabalho)
                VALUES (${idTrabalho}, ${idVoluntario}, ${quantidadeVagas}, '${duracao}', '${atividadeTrabalho}')
                RETURNING id_Participacao;`;

            // Executa a query no banco de dados
            const respostaBD = await database.query(queryInsertParticipacao);

            // Verifica se houve inserção bem-sucedida, retornando true se sim, false caso contrário
            if (respostaBD.rowCount !== 0) {
                console.log(`Participação de trabalho cadastrada com sucesso. ID Participação: ${respostaBD.rows[0].id_Participacao}`);
                return true;
            }

            return false;
        } catch (error) {
            // Em caso de erro, exibe a mensagem no console e retorna false
            console.log('Erro ao cadastrar a Participação. Consulte os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }
}
