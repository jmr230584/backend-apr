/**
 * Interface para representar os dados do mural recebidos da API
 */
interface MuralTrabalhosDTO {
    idMuralTrabalhos: number;
    nomeTrabalho: string;               // nome do trabalho do mural (identificação única)
    ongResponsavel: string;              // ong responsável do trabalho
    totalVoluntarios: number;         //  total de voluntários no trabalho
    dataEncerramento: Date;     // Data de encerramento do trabalho

}

export default MuralTrabalhosDTO;