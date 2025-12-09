import { DatabaseModel } from "./DatabaseModel";

const database = new DatabaseModel().pool;

export class ParticipacaoTrabalho {
    private idParticipacao: number = 0;
    private idTrabalho: number;
    private idVoluntario: number;
    private quantidadeVagas: number;
    private duracao: string;
    private atividadeTrabalho: string;

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

    // =====================
    // GETTERS E SETTERS
    // =====================

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

    static async listarParticipacao(): Promise<any[] | null> {
        try {
            const query = `SELECT * FROM participacao`;
            const resposta = await database.query(query);

            if (!resposta || resposta.rows.length === 0) return null;

            return resposta.rows.map((row: any) => ({
                idParticipacao: row.id_participacao,
                idTrabalho: row.id_trabalho,
                idVoluntario: row.id_voluntario,
                quantidadeVagas: row.quantidade_vagas,
                duracao: row.duracao,
                atividadeTrabalho: row.atividade_trabalho,
                statusParticipacaoVoluntario: row.status_participacao_voluntario
            }));
        } catch (error) {
            console.error("Erro ao listar participações:", error);
            return null;
        }
    }

    static async listar(id: number): Promise<ParticipacaoTrabalho | null> {
        try {
            const query = `SELECT * FROM participacao WHERE id_participacao = $1`;
            const resposta = await database.query(query, [id]);

            if (!resposta || resposta.rows.length === 0) return null;

            const row = resposta.rows[0];

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
            return null;
        }
    }

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
            `;

            const resultado = await database.query(query, [
                idTrabalho, idVoluntario, quantidadeVagas, duracao, atividadeTrabalho
            ]);

            return (resultado?.rowCount ?? 0) > 0;

        } catch (error) {
            console.error("Erro ao cadastrar participação:", error);
            return false;
        }
    }

    static async atualizarParticipacao(participacao: ParticipacaoTrabalho): Promise<boolean> {
        try {
            const query = `
                UPDATE participacao SET
                    id_trabalho = $1,
                    id_voluntario = $2,
                    quantidade_vagas = $3,
                    duracao = $4,
                    atividade_trabalho = $5
                WHERE id_participacao = $6
            `;

            const valores = [
                participacao.getIdTrabalho(),
                participacao.getIdVoluntario(),
                participacao.getQuantidadeVagas(),
                participacao.getDuracao(),
                participacao.getAtividadeTrabalho(),
                participacao.getIdParticipacao()
            ];

            const resultado = await database.query(query, valores);

            return (resultado?.rowCount ?? 0) > 0;

        } catch (error) {
            console.error("Erro ao atualizar participação:", error);
            return false;
        }
    }

    static async removerParticipacao(idParticipacao: number): Promise<boolean> {
        try {
            const query = `
                UPDATE participacao
                SET status_participacao_voluntario = FALSE
                WHERE id_participacao = $1
            `;

            const resultado = await database.query(query, [idParticipacao]);

            return (resultado?.rowCount ?? 0) > 0;

        } catch (error) {
            console.error("Erro ao remover participação:", error);
            return false;
        }
    }
}
