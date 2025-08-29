/**
 * Interface para representar os dados do voluntario recebidos da API
 */
interface VoluntarioDTO {
    idVoluntario: number;
    cpf: string;               // CPF do voluntário (identificação única)
    nome: string;              // Nome do voluntário
    sobrenome: string;         // Sobrenome do voluntário
    dataNascimento: Date;     // Data de nascimento do voluntário
    endereco: string;          // Endereço do voluntário
    email: string;             // E-mail para contato
    telefone: string;          // Telefone de contato
}

export default VoluntarioDTO;
