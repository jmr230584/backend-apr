import { Usuario } from "../model/Usuario"; // modelo do usuário
import { Request, Response } from "express"; // Request e Response do express
import fs from 'fs'; // Importa o módulo fs para manipulação de arquivos (file system)
import path from 'path';  // Importa o módulo path para lidar com caminhos de arquivos e diretórios
import { upload } from "../config/multerConfig";
import { DatabaseModel } from "../model/DatabaseModel";
import bcrypt from 'bcrypt';
import { Auth } from "../util/Auth";


const database = new DatabaseModel().pool;

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
     * @returns Mensagem de sucesso ou erro em formato  JSON.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            //Chama o método estatico do modelo para obter a lista de usuários
            const listaDeUsuarios = await Usuario.listarUsuarios();

            //Se ocorrererro no modelo, retorna 500
            if (listaDeUsuarios === null){
                return res.status(500).json({ erro:  'Erro ao recuperar usuários'});
            }

            //Retorna a lista JSON
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
                console.log('req.body:', req.body);
                console.log('req.file:', req.file);
            // Verifica/Cria o diretório de uploads 
            const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true})
            }
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
            return res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso' });
        } catch (error) {
            // Em caso de erro, registra nos logs e retorna erro para o cliente
            console.error('Erro ao cadastrar usuário:', error);
            res.status(400).json({ erro: 'Erro ao cadastrar usuário', detalhes: error });
        }
    }

    /**
 * Autentica um usuário (login).
 * Verifica se o email/username existe e se a senha está correta.
 */
   static async login(req: Request, res: Response) {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.autenticar(email, senha);

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos" });
    }

    return res.status(200).json({
      uuid: usuario.getUuidUsuario(),
      nome: usuario.getNome(),
      username: usuario.getUsername(),
      email: usuario.getEmail(),
      imagemPerfil: usuario.getImagemPerfil()
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ erro: "Erro no login" });
  }
}

static async validacaoUsuario(req: Request, res: Response): Promise<any> {
  const { email, senha } = req.body;

  try {
    const query = `SELECT id_usuario, nome, username, senha FROM usuario WHERE email = $1`;
const resultado = await database.query(query, [email]);


    if (resultado.rowCount === 0) {
      return res.status(401).json({ auth: false, message: 'Usuário não encontrado' });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ auth: false, message: 'Senha incorreta' });
    }

    const token = Auth.generateToken(usuario.id_usuario, usuario.nome, usuario.username);

    return res.status(200).json({
      auth: true,
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        username: usuario.username
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ auth: false, message: 'Erro interno no servidor' });
  }
}

static async autenticar(email: string, senha: string): Promise<Usuario | null> {
  const query = `SELECT * FROM usuario WHERE email = $1`;
  const resultado = await database.query(query, [email]);

  if (resultado.rowCount === 0) {
    return null;
  }

  const usuarioData = resultado.rows[0];

  // Verifica a senha com bcrypt
  const senhaValida = await bcrypt.compare(senha, usuarioData.senha);

  if (!senhaValida) {
    return null;
  }

  // Cria um objeto Usuario com os dados retornados
  const usuario = new Usuario(usuarioData.nome, usuarioData.username, usuarioData.email);
  usuario.setUuidUsuario(usuarioData.uuid);
  usuario.setSenha(usuarioData.senha); // Armazenar a hash da senha
  usuario.setImagemPerfil(usuarioData.imagem_perfil);

  return usuario;
}
}

export default UsuarioController;