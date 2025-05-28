import { Usuario } from "../model/Usuario"; // modelo do usuário
import { Request, Response } from "express"; // Request e Response do express
import fs from 'fs'; // Importa o módulo fs para manipulação de arquivos (file system)
import path from 'path';  // Importa o módulo path para lidar com caminhos de arquivos e diretórios

/**
 * Interface UsuarioDTO
 * Define os atributos esperados na requisição de cadastro de usuário
 */
interface UsuarioDTO {
    nome: string;       // Nome completo do usuário
    username: string;   // Nome de usuário para login
    email: string;      // Endereço de e-mail
    senha: string;      // Senha de acesso
}

/**
 * Controlador responsável pelas operações relacionadas aos usuários.
 */
class UsuarioController extends Usuario {    
    /**
     * Lista todos os usuários.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de usuários em formato JSON.
     */
    static async todos(req: Request, res: Response) {
        try {
            const listaDeUsuarios = await Usuario.listarUsuarios();

            res.status(200).json(listaDeUsuarios);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);

            res.status(400).json("Erro ao recuperar as informações do usuário");
        }
    }

}

export default UsuarioController;