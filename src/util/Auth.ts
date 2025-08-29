// imports necessários
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DatabaseModel } from '../model/DatabaseModel';
import bcrypt from 'bcrypt';


// palavra secreta para geração do token JWT
const SECRET = 'voluntariosBrasil';

// pool de conexão com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Interface para representar o payload do JWT
 */
interface JwtPayload {
    id: number;
    nome: string;
    username: string;
    exp: number;
}

/**
 * Classe responsável por autenticação
 */
export class Auth {
    /**
     * Valida as credenciais do usuário no banco de dados
     * @param req Requisição com { username, senha }
     * @param res Resposta enviada ao cliente
     */
    static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        const { username, senha } = req.body;

        // busca usuário pelo username
        const query = `SELECT id_usuario, nome, username, senha, imagem_perfil 
                       FROM usuario WHERE username = $1`;
        const resultado = await database.query(query, [username]);

        // se não encontrou usuário
        if (resultado.rowCount === 0) {
            return res.status(400).json({ auth: false, message: 'Usuário não encontrado' });
        }

        const usuario = resultado.rows[0];

        // compara a senha informada com a senha do banco (hash com bcrypt)
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ auth: false, message: 'Senha incorreta' });
        }

        // gera token JWT válido por 1 hora
        const token = this.generateToken(usuario.id_usuario, usuario.nome, usuario.username);

        // retorna no formato que o frontend espera
        return res.status(200).json({
            auth: true,
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                username: usuario.username,
                avatarUrl: usuario.imagem_perfil || '' // compatível com frontend
            }
        });
    }

    /**
     * Gera token de autenticação do usuário
     */
    static generateToken(id: number, nome: string, username: string) {
        return jwt.sign({ id, nome, username }, SECRET, { expiresIn: '1h' });
    }

    /**
     * Middleware para verificar se o token é válido
     */
    static verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            return res.status(401).json({ message: "Token não informado", auth: false }).end();
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token expirado, faça login novamente", auth: false }).end();
                } else {
                    return res.status(401).json({ message: "Token inválido, faça login", auth: false }).end();
                }
            }

            const { exp, id } = decoded as JwtPayload;

            if (!exp || !id) {
                return res.status(401).json({ message: "Token inválido, faça login", auth: false }).end();
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > exp) {
                return res.status(401).json({ message: "Token expirado, faça login novamente", auth: false }).end();
            }

            req.body.userId = id;
            next();
        });
    }
}
