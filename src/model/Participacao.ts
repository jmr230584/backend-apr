import { DatabaseModel } from "./DatabaseModel";
import { Trabalho } from "./Trabalho";
import { Voluntario } from "./Voluntario"

// Pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

// Exporta a interface (opcional)
export interface Participacao {
    idParticipacao: number;
    idTrabalho: number;
    idVoluntario: number;
    quantidadeVagas: number;
    duracao: string;
    atividadeTrabalho: string;
}

/**
 * Classe que representa uma Participação em Trabalho
 */
export class ParticipacaoTrabalho {
    public idTrabalho: number;
    public idVoluntario: number;
    public quantidadeVagas: number;
    public duracao: string;
    public atividadeTrabalho: string;
    public idParticipacao: number;

    constructor(
        idParticipacao: number,
        idTrabalho: number,
        idVoluntario: number,
        quantidadeVagas: number,
        duracao: string,
        atividadeTrabalho: string,
    ) {
        this.idParticipacao = idParticipacao;
        this.idTrabalho = idTrabalho;
        this.idVoluntario = idVoluntario;
        this.quantidadeVagas = quantidadeVagas;
        this.duracao = duracao;
        this.atividadeTrabalho = atividadeTrabalho;
    }

    // ================== GETTERS E SETTERS =====================

    public getIdParticipacao(): number {
        return this.idParticipacao;
    }

    public setIdParticipacao(_idParticipacao: number): void {
        this.idParticipacao = _idParticipacao;
    }

    public getIdTrabalho(): number {
        return this.idTrabalho;
    }

    public setIdTrabalho(idTrabalho: number): void {
        this.idTrabalho = idTrabalho;
    }

    public getIdVoluntario(): number {
        return this.idVoluntario;
    }

    public setIdVoluntario(idVoluntario: number): void {
        this.idVoluntario = idVoluntario;
    }

    public getQuantidadeVagas(): number {
        return this.quantidadeVagas;
    }

    public setQuantidadeVagas(quantidadeVagas: number): void {
        this.quantidadeVagas = quantidadeVagas;
    }

    public getDuracao(): string {
        return this.duracao;
    }

    public setDuracao(duracao: string): void {
        this.duracao = duracao;
    }

    public getAtividadeTrabalho(): string {
        return this.atividadeTrabalho;
    }

    public setAtividadeTrabalho(atividadeTrabalho: string): void {
        this.atividadeTrabalho = atividadeTrabalho;
    }

    // ================== MÉTODOS ESTÁTICOS =====================

    /**
     * Lista todas as participações
     */
    static async listarParticipacao(): Promise<Array<any> | null> {
        let listaDeParticipacao: Array<any> = [];

        try {
            const querySelect = `SELECT * FROM participacao`;
            const respostaBD = await database.query(querySelect);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            respostaBD.rows.forEach((linha: any) => {
                const participacao = {
                    idParticipacao: linha.id_participacao,
                    idVoluntario: linha.id_voluntario,
                    idTrabalho: linha.id_trabalho,
                    quantidadeVagas: linha.quantidade_vagas,
                    duracao: linha.duracao,
                    atividadeTrabalho: linha.atividade_trabalho,
                    statusParticipacaoVoluntario: linha.status_participacao_voluntario
                };

                listaDeParticipacao.push(participacao);
            });

            return listaDeParticipacao;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Busca participação por ID
     */
    static async listar(id: number): Promise<ParticipacaoTrabalho | null> {
        try {
            const query = `SELECT * FROM participacao WHERE id_participacao = $1`;
            const resultado = await database.query(query, [id]);

            if (resultado.rows.length === 0) {
                return null;
            }

            const row = resultado.rows[0];

            return new ParticipacaoTrabalho(
                row.id_participacao,
                row.id_trabalho,
                row.id_voluntario,
                row.quantidade_vagas,
                row.duracao,
                row.atividade_trabalho
            );
        } catch (error) {
            console.error("Erro ao buscar participação por ID:", error);
            throw error;
        }
    }

    /**
     * Cadastra uma nova participação
     */
    static async cadastrarParticipacao(
        idTrabalho: number,
        idVoluntario: number,
        quantidadeVagas: number,
        duracao: string,
        atividadeTrabalho: string
    ): Promise<boolean> {

        try {
            const query = `
                INSERT INTO participacao
                (id_trabalho, id_voluntario, quantidade_vagas, duracao, atividade_trabalho)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_participacao
            `;

            const respostaBD = await database.query(query, [
                idTrabalho,
                idVoluntario,
                quantidadeVagas,
                duracao,
                atividadeTrabalho
            ]);

            return respostaBD.rowCount > 0;

        } catch (error) {
            console.error("Erro ao cadastrar participação:", error);
            throw error;
        }
    }

    /**
     * Atualiza uma participação
     */
    static async atualizarParticipacao(participacao: ParticipacaoTrabalho): Promise<boolean> {

        try {
            const queryAtualizar = `
                UPDATE participacao SET
                    id_trabalho = $1,
                    id_voluntario = $2,
                    quantidade_vagas = $3,
                    duracao = $4,
                    atividade_trabalho = $5
                WHERE id_participacao = $6
            `;

            const result = await database.query(queryAtualizar, [
                participacao.idTrabalho,
                participacao.idVoluntario,
                participacao.quantidadeVagas,
                participacao.duracao,
                participacao.atividadeTrabalho,
                participacao.idParticipacao
            ]);

            return respostaBD.rowCount > 0;


        } catch (error) {
            console.error("Erro ao atualizar participação:", error);
            return false;
        }
    }

    /**
     * Remove (desativa) participação
     */
    static async removerParticipacao(idParticipacao: number): Promise<boolean> {
        try {
            const queryUpdate = `
                UPDATE participacao
                SET status_participacao_voluntario = FALSE
                WHERE id_participacao = $1
            `;

            const resultado = await database.query(queryUpdate, [idParticipacao]);

            return respostaBD.rowCount > 0;


        } catch (error) {
            console.error("Erro ao ocultar participação:", error);
            return false;
        }
    }
}
