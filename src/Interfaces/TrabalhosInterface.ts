/**
 * Interface para representar os dados do trabalho recebidos da API
 */
interface TrabalhoDTO { 
    nomeTrabalho: string;      // Nome do trabalho/atividade voluntária
    ongResponsavel: string;    // Nome da ONG responsável pelo trabalho
    localizacao: string;       // Local onde o trabalho será realizado
    dataInicio: Date;          // Data de início do trabalho
    dataTermino: Date;         // Data de término do trabalho
}

export default TrabalhoDTO;