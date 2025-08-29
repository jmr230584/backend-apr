/**
 * Interface para representar os dados da participação recebidos da API
*/
interface ParticipacaoDTO {
    idTrabalho: number;
    idVoluntario: number;
    quantidadeVagas: number;
    duracao: string;
    atividadeTrabalho: string;
}

export default ParticipacaoDTO;