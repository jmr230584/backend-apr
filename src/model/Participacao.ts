import { DatabaseModel } from "./DatabaseModel";
import { Trabalho } from "./Trabalho";
import { Voluntario } from "./Voluntario"

// Pool de conexões
const database = new DatabaseModel().pool;

export interface Participacao {
    idParticipacao: number;
    idTrabalho: number;
    idVoluntario: number;
    quantidadeVagas: number;
    duracao: string;
    atividadeTrabalho: string;
}

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

    public getIdParticipacao(): number { return this.idParticipacao; }
    public setIdParticipacao(v: number): void { this.idParticipacao = v; }

    public getIdTrabalho(): number { return this.idTrabalho; }
    public setIdTrabalho(v: number): void { this.idTrabalho = v; }

    public getIdVoluntario(): number { return this.idVoluntario; }
    public setIdVoluntario(v: number): void { this.idVoluntario = v; }

    public getQuantidadeVagas(): number { return this.quantidadeVagas; }
    public setQuantidadeVagas(v: number): void { this.quantidadeVagas = v; }

    public getDuracao(): string { return this.duracao; }
    public setDuracao(v: string): void { this.duracao = v; }

    public getAtividadeTrabalho(): string { return this.atividadeTrabalho; }
    public setAtividadeTrabalho(v: string): void { this.atividadeTrabalho = v; }

    // =========================================
    // LISTAR TODAS PARTICIPAÇÕES
    // =========================================

    static async listarParticipacao(): Promise<Array<any> | null> {
        try {
            const querySelect = `SELECT * FROM participacao`;
            const respostaBD = await database.query(querySelect);

            if (!respostaBD || respostaBD.rows.length === 0) return null;

            return respostaBD.rows.map((row: any) => ({
                idParticipacao: row.id_participacao,
                idVoluntario: row.id_voluntario,
                idTrabalho: row.id_trabalho,
                quantidadeVagas: row.quantidade_vagas,
                duracao: row.duracao,
                atividadeTrabalho: row.atividade_trabalho,
                statusParticipacaoVoluntario: row.status_participacao_voluntario
            }));

        } catch (error) {
            console.log("Erro ao acessar Participacao:", error);
            return null;
        }
    }

    // =========================================
    // BUSCAR POR ID
    // =========================================

    static async listar(id: number): Promise<ParticipacaoTrabalho | null> {
        try {
            const query = `SELECT * FROM participacao WHERE id_participacao = $1`;
            const respostaBD = await database.query(query, [id]);

            if (!respostaBD || respostaBD.rows.length === 0) return null;

            const row = respostaBD.rows[0];

            return new ParticipacaoTrabalho(
                row.id_participacao,
                row.id_trabalho,
                row.id_voluntario,
                row.quantidade_vagas,
                row.duracao,
                row.atividade_trabalho
            );
        } catch (error) {
            console.error("Erro ao buscar participação:", error);
            throw error;
        }
    }

    // =========================================
    // CADASTRAR PARTICIPAÇÃO
    // =========================================

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
                VALUES ($1,$2,$3,$4,$5)
                RETURNING id_participacao
            `;

            const respostaBD = await database.query(query, [
                idTrabalho,
                idVoluntario,
                quantidadeVagas,
                duracao,
                atividadeTrabalho
            ]);

            return (respostaBD?.rowCount ?? 0) > 0;

        } catch (error) {
            console.error("Erro ao cadastrar participação:", error);
            throw error;
        }
    }

    // =========================================
    // ATUALIZAR PARTICIPAÇÃO
    // =========================================

    static async atualizarParticipacao(participacao: ParticipacaoTrabalho): Promise<boolean> {
        try {
            const queryAtualizar = `
                UPDATE participacao SET
                    id_trabalho=$1, id_voluntario=$2,
                    quantidade_vagas=$3, duracao=$4,
                    atividade_trabalho=$5
                WHERE id_participacao=$6
            `;

            const resultado = await database.query(queryAtualizar, [
                participacao.idTrabalho,
                participacao.idVoluntario,
                participacao.quantidadeVagas,
                participacao.duracao,
                participacao.atividadeTrabalho,
                participacao.idParticipacao
            ]);

            return (resultado?.rowCount ?? 0) > 0;

        } catch (error) {
            console.error("Erro ao atualizar participação:", error);
            return false;
        }
    }

    // =========================================
    // REMOVER/DESATIVAR PARTICIPAÇÃO
    // =========================================

    static async removerParticipacao(idParticipacao: number): Promise<boolean> {
        try {
            const queryUpdate = `
                UPDATE participacao
                SET status_participacao_voluntario = FALSE
                WHERE id_participacao = $1
            `;

            const resultado = await database.query(queryUpdate, [idParticipacao]);

            return (resultado?.rowCount ?? 0) > 0;

        } catch (error) {
            console.error("Erro ao remover participação:", error);
            return false;
        }
    }
}
