import { DatabaseModel } from "./DatabaseModel";
import { Trabalho } from "./Trabalho";
import { Voluntario } from "./Voluntario"

// Pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

// Exporta a interface (opcional, se você quiser usá-la no controller)
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
    public atividadeTrabalho: string
    idParticipacao: number;

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
              SELECT * FROM participacao`;

          // Executa a query no banco de dados
           const respostaBD = await database.query(querySelectParticipação);

          // Verifica se há resultados
          if (respostaBD.rows.length === 0) {
            return null;
          }

          // Itera sobre as linhas retornadas
          respostaBD.rows.forEach((linha: any) => {
             // Monta o objeto de participação com os dados do voluntário e do trabalho
              const ParticipacaoTrabalho = {
                  idParticipacao: linha.id_participacao,
                  idVoluntario: linha.id_voluntario,
                  idTrabalho: linha.id_trabalho,
                  quantidadeVagas: linha.quantidade_vagas,
                  duracao: linha.duracao,
                  atividadeTrabalho: linha.atividade_trabalho,
                  statusParticipacaoVoluntario: linha.status_participacao_voluntario,
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
    static async listar(id: number): Promise<ParticipacaoTrabalho | null> {
        try {
            const query = `SELECT * FROM Participacao`;
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
      * Atualiza as informações de uma participação no banco de dados.
      *
      * @param participacao- O objeto participação contendo as informações atualizadas.
      * @returns Uma Promise que resolve para `true` se a participação foi atualizada com sucesso, ou `false` caso contrário.
      *
      * @throws Lança um erro se ocorrer um problema durante a atualização do participação.
      */
  static async atualizarParticipacao(Participacao: ParticipacaoTrabalho): Promise<boolean> {{
         let queryResult = false; // Variável para armazenar o resultado da operação.
         try {
             // Construção da query SQL para atualizar os dados do voluntário no banco de dados.
             const queryAtualizarParticpacao = `UPDATE participacao SET 
                                                      id_trabalho = ${Participacao.idTrabalho},
                                                      id_voluntario = ${Participacao.idVoluntario},
                                                      quantidade_vagas = ${Participacao.quantidadeVagas},
                                                      duracao = '${Participacao.duracao}',
                                                      atividade_trabalho = '${Participacao.atividadeTrabalho}'
                                               WHERE id_participacao = ${Participacao.idParticipacao}`;
             // Executa a query de atualização e verifica se a operação foi bem-sucedida.
             await database.query(queryAtualizarParticpacao)
             .then((result) => {
                 if (result.rowCount != 0) {
                     queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                 }
             });
 
             // Retorna o resultado da operação para quem chamou a função.
             return queryResult;
         } catch (error) {
             // Em caso de erro na consulta, exibe o erro no console e retorna false.
             console.log(`Erro na consulta: ${error}`);
             return queryResult;
         }
     }
    }

    /**
     * Remove uma participação
     */
    static async removerParticipacao(idParticipacao: number): Promise<boolean> {
        let queryResult = false;
    
        try {
            console.log("ID recebido:", idParticipacao);
    
            // Query com placeholder correto
            const queryUpdateParticipacao = `UPDATE participacao 
                                              SET status_participacao_voluntario = FALSE
                                              WHERE id_participacao  = $1',
  [id]`;
    
            console.log("Query a ser executada:", queryUpdateParticipacao);
            console.log("Parâmetros:", [idParticipacao]);
    
            // Executa a query para "remover" a participação sem deletá-la
            const resultado = await database.query(queryUpdateParticipacao, [idParticipacao]);
    
            // Verifica se a operação foi bem-sucedida
            if (resultado.rowCount && resultado.rowCount > 0) {
                console.log(`Participação ocultada com sucesso: ID: ${idParticipacao}`);
                queryResult = true;
            }
    
            return queryResult;
        } catch (error) {
            console.error("Erro ao ocultar participação:", error);
            return queryResult;
        }
    }    
}

