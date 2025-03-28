import { DatabaseModel } from "./DatabaseModel";
import { Trabalho } from "./Trabalho";
import { Voluntario } from "./Voluntario";

// Pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa uma Participação em Trabalho
 */
export class ParticipacaoTrabalho {
    private idParticipacao :number = 0 ;
    private idTrabalho: number;
    private idVoluntario: number;
    private quantidadeVagas: number;
    private duracao: string;
    private atividadeTrabalho: string;

    /**
     * Construtor da classe
     * @param idParticipacao ID da paricipação 
     * @param idTrabalho ID do trabalho
     * @param idVoluntario ID do voluntário
     * @param quantidadeVagas Quantidade de vagas
     * @param duracao Duração da participação
     * @param atividadeTrabalho Descrição da atividade
     * @param idParticipacao ID da participação (opcional)
     */
    constructor(
        idParticipacao : number,
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
        
        if (idParticipacao) {
            this.idParticipacao = idParticipacao;
        }
    }

    // Getters e Setters

    public getIdParticipacao():number{
        return this.idParticipacao;
    }


    public setIdParticipacao(_idParticipacao:number):void {
         this.idParticipacao
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

    // Métodos estáticos para operações no banco de dados

   /**
     * Retorna uma lista com todos os participação cadastrados no banco de dados
     * 
     * @returns Lista com todos os participação cadastrados no banco de dados
     */
    static async listarParticipacao(): Promise<Array<any> | null> {
        // Criando lista vazia para armazenar os participação
        let listaDeParticipacao: Array<any> = [];

        try {
          // Query para consulta no banco de dados
            const querySelectParticipação = `
              SELECT e.id_participacao, e.id_voluntario, e.id_trabalho,
                     e.quantidade_vagas, e.duracao, e.atividade_trabalho,
                     a.cpf, a.nome, a.sobrenome, a.telefone, 
                     l.nome_trabalho, l.ong_responsavel, l.localizacao
              FROM participacao e
              JOIN voluntario a ON e.id_voluntario = a.id_voluntaio
              JOIN trabalho l ON e.id_trabalho = l.id_trabalho;
              WHERE e.status_participacao_voluntario = TRUE;`;

          // Executa a query no banco de dados
           const respostaBD = await database.query(querySelectParticipação);

          // Verifica se há resultados
          if (respostaBD.rows.length === 0) {
            return null;
          }

          // Itera sobre as linhas retornadas
          respostaBD.rows.forEach((linha: any) => {
             // Monta o objeto de empréstimo com os dados do aluno e do livro
              const emprestimo = {
                  idParticipacao: linha.id_participacao,
                  idVoluntario: linha.id_voluntaio,
                  idTrabalho: linha.id_trabalho,
                  quantidadeVagas: linha.quantidade_vagas,
                  duracao: linha.duracao,
                  atividadeTrabalho: linha.atividade_trabalho,
                  statusEmprestimoRegistro: linha.status_emprestimo_registro,
                  Voluntario: {
                    cpf: linha.cpf,
                    nome: linha.nome,
                    sobrenome: linha.sobrenome,
                    telefone: linha.telefone
                  },
                  Trabalho: {
                    nomeTrabalho: linha.nomeTrabalho,
                    ongResponsavel: linha.ongResponsavel,
                    localizacao: linha.localizacao
                  }
                };

                // Adiciona o objeto à lista de participação
                listaDeParticipacao.push(ParticipacaoTrabalho);
            });

            // retorna a lista de participação
            return listaDeParticipacao;

            // captura qualquer erro que possa acontecer
        } catch (error) {
          // exibe o erro detalhado no console
            console.log(`Erro ao acessar o modelo: ${error}`);
          // retorna um valor nulo
            return null;
        }
    } 


    /**
     * Busca uma participação por ID
     * @param id ID da participação
     * @returns Participação encontrada ou null
     */
    static async buscarPorId(id: number): Promise<ParticipacaoTrabalho | null> {
        try {
            const query = `SELECT * FROM Participacao WHERE id_participacao = $1`;
            const resultado = await database.query(query, [id]);
            
            if (resultado.rows.length === 0) {
                return null;
            }
            
            const row = resultado.rows[0];
            return new ParticipacaoTrabalho(
                row.id_trabalho,
                row.id_voluntario,
                row.quantidade_vagas,
                row.duracao,
                row.atividade_trabalho,
                row.id_participacao
            );
        } catch (error) {
            console.error("Erro ao buscar participação por ID:", error);
            throw error;
        }
    }

    /**
     * Cadastra uma nova participação
     * @param idTrabalho ID do trabalho
     * @param idVoluntario ID do voluntário
     * @param quantidadeVagas Quantidade de vagas
     * @param duracao Duração da participação
     * @param atividadeTrabalho Descrição da atividade
     * @returns true se cadastrou com sucesso, false caso contrário
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
                INSERT INTO Participacao 
                (id_trabalho, id_voluntario, quantidade_vagas, duracao, atividade_trabalho)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_participacao`;
                
            const respostaBD = await database.query(query, [
                idTrabalho,
                idVoluntario,
                quantidadeVagas,
                duracao,
                atividadeTrabalho
            ]);
            
             if(respostaBD.rowCount != 0) {
                console.log(`Participação atualizada com sucesso`);
                return true;
            }
            return false;

        } catch (error) {
            console.error("Erro ao cadastrar participação:", error);
            throw error;
        }
    }

    /**
     * Atualiza uma participação existente
     * @param idParticipacao ID da participação
     * @param idTrabalho ID do trabalho
     * @param idVoluntario ID do voluntário
     * @param quantidadeVagas Quantidade de vagas
     * @param duracao Duração da participação
     * @param atividadeTrabalho Descrição da atividade
     * @returns true se atualizou com sucesso, false caso contrário
     */
    static async atualizarParticipacao(idParticipacao: number, idTrabalho: number, idVoluntario: number, 
        quantidadeVagas: number, duracao: string, atividadeTrabalho: string): Promise<any> {
        try {
            const queryUpdateParticipacao = `UPDATE Participacao SET 
                                              id_trabalho = '${idTrabalho}',
                                              id_voluntario = '${idVoluntario}',
                                              quantidade_vagas = '${quantidadeVagas}',
                                              duracao = '${duracao}',
                                              atividade_trabalho = '${atividadeTrabalho}',
                                              WHERE id_participacao = ${idParticipacao}`;
                
            const respostaBD = await database.query(queryUpdateParticipacao);
            
            if(respostaBD.rowCount != 0) {
                console.log(`Participação atualizada com sucesso: ID: ${idParticipacao}`);
                return true;
            }
            return false;

        } catch (error) {
            console.error("Erro ao atualizar participação:", error);
            throw error;
        }
    }

    /**
     * Remove uma participação
     */
    static async removerParticipacao(idParticipacao: number): Promise<any> {
        try {
            const query = `DELETE FROM Participacao WHERE id_participacao = ${idParticipacao}`;
            const resultado = await database.query(query, [idParticipacao]);
            
            if (resultado.rowCount && resultado.rowCount > 0) {
                console.log(`Participação removida com sucesso: ID: ${idParticipacao}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao remover participação:", error);
            throw error;
        }
    }
}
