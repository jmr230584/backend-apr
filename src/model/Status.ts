import { DatabaseModel } from "./DatabaseModel"; // Importa a classe de conexão com o banco de dados

// Armazena o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa o Status de um Trabalho.
 */
export class StatusTrabalho {
    // Método para listar todos os status cadastrados
    static async listarStatus(): Promise<any[]> {
        try {
            // Query para buscar todos os status no banco de dados
            const query = `SELECT * FROM status`;
            const resultado = await database.query(query);

            // Retorna as linhas da consulta
            return resultado.rows;
        } catch (error) {
            console.error("Erro ao listar status:", error);
            throw error; // Lança o erro para ser tratado no controlador
        }
    }

    static async cadastroStatus(idTrabalho: number, idVoluntario:number, quantidadeVagas:number, duracao: string, statusTrabalho:string): Promise<boolean> {
        try {
            const queryInsertEmprestimo = `INSERT INTO emprestimo (id_trabalho, id_voluntario, quantidade_vagas, duracao, status_trabalho)
                                        VALUES (${idTrabalho}, 
                                                ${idVoluntario}, 
                                               '${quantidadeVagas}', 
                                               '${duracao},
                                               '${statusTrabalho}'
                                        RETURNING id_status;`;

            const respostaBD = await database.query(queryInsertEmprestimo);
            if(respostaBD.rowCount != 0) {
                console.log(`Status de trabalho cadastrado com sucesso. ID status: ${respostaBD.rows[0].id_status}`);
                return true;
            }

            return false;
        } catch (error) {
            console.log('Erro ao cadastrar o status. Consulte os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }
}