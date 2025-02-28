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
            const query = `SELECT * FROM status_trabalho`;
            const resultado = await database.query(query);

            // Retorna as linhas da consulta
            return resultado.rows;
        } catch (error) {
            console.error("Erro ao listar status:", error);
            throw error; // Lança o erro para ser tratado no controlador
        }
    }
}