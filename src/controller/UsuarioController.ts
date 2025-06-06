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

    /**
     * Cadastra um novo usuário.
     * Também processa o upload da imagem de perfil, se fornecida.
     * 
     * @param req Objeto de requisição HTTP contendo os dados do usuário e, opcionalmente, o arquivo de imagem.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            // Extrai os dados do corpo da requisição
            const dadosRecebidos: UsuarioDTO = req.body;

            // Instancia um novo objeto de usuário com os dados recebidos
            const novoUsuario = new Usuario(
                dadosRecebidos.nome,
                dadosRecebidos.username,
                dadosRecebidos.email
            );

            // Define a senha do usuário (armazenada de forma segura no modelo)
            novoUsuario.setSenha(dadosRecebidos.senha);

            // Cadastra o usuário no banco de dados e obtém seu UUID
            const uuid = await Usuario.cadastroUsuario(novoUsuario);

            // Se não foi possível cadastrar, retorna erro
            if (!uuid) {
                return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
            }

            // Se uma imagem de perfil foi enviada, renomeia e atualiza o nome no banco
            if (req.file) {
                const ext = path.extname(req.file.originalname); // Pega a extensão original do arquivo
                const novoNome = `${uuid}${ext}`; // Define o novo nome do arquivo como o UUID do usuário
                const antigoPath = req.file.path; // Caminho temporário do upload
                const novoPath = path.resolve(req.file.destination, novoNome); // Caminho de destino final

                fs.renameSync(antigoPath, novoPath); // Renomeia o arquivo no sistema de arquivos

                await Usuario.atualizarImagemPerfil(uuid, novoNome); // Atualiza o nome do arquivo no banco de dados
            }

            // Retorna sucesso
            return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
        } catch (error) {
            // Em caso de erro, registra nos logs e retorna erro para o cliente
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: error });
        }
    }
}

export default UsuarioController;