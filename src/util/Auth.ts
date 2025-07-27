// imports
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DatabaseModel } from '../model/DatabaseModel';
import bcrypt from 'bcrypt';

// palavra secreta
const SECRET = 'voluntariosBrasil';
// pool de conexão ao banco de dados
const database = new DatabaseModel().pool;

/**
 * Interface para representar um Payload do JWT
 * (Não obrigatório, mas recomendado)
 */
interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    exp: number;
}

/**
 * Gera e trata um token de autenticação para o sistema
 */
export class Auth {

    /**
     * Valida as credenciais do usuário no banco de dados
     * @param req Requisição com as informações do usuário
     * @param res Resposta enviada a quem requisitou o login
     * @returns Token de autenticação caso o usuário seja válido, mensagem de login não autorizado caso negativo
     */
   static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        const { username, senha } = req.body; 

        const query = `SELECT id_usuario, nome, username, senha FROM usuario WHERE username = $1`; 
        const resultado = await database.query(query, [username]);
        
        (resultado.rowCount === 0); {
    return res.status(401).json({ auth: false, message: 'Usuário não encontrado' });
  } 
        const usuario = resultado.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaCorreta) {
            return res.status(401).json({ auth: false, message: 'Senha incorreta' });
  }
  
  return res.status(200).json({ auth: true, message: 'Login realizado com sucesso', usuario });
}

    /**
     * Gera token de validação do usuário
     * 
     * @param id ID do usuário no banco de dados
     * @param nome Nome do usuário no banco de dados
     * @param email Email do usuário no banco de dados
     * @returns Token de autenticação do usuário
     */
    static generateToken(id: number, nome: string, username: string) {
		    // retora o token gerado
		    // id: ID do professor no banco de dados
		    // nome: nome do professor no banco de dados
		    // email: email do professor no banco de dados
		    // SECRET: palavra secreta
		    // expiresIn: tempo até a expiração do token (neste exemplo, 1 hora)
        return jwt.sign({ id, nome, username }, SECRET, { expiresIn: '1h' });
    }

    /**
     * Verifica o token do usuário para saber se ele é válido
     * 
     * @param req Requisição
     * @param res Resposta
     * @param next Próximo middleware
     * @returns Token validado ou erro
     */
    static verifyToken(req: Request, res: Response, next: NextFunction) {
		    // recebe no cabeçalho da requisição do cliente o token que ele possui 
        const token = req.headers['x-access-token'] as string;

				 // verifica se nenhum token foi informado
        if (!token) {
            console.log('Token não informado');
            // se nenhum token foi informado, é enviada uma mensagem e o status de autenticação (falso)
            return res.status(401).json({ message: "Token não informado", auth: false }).end();
        }

        // verifica se o token recebido é válido
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                // verifica se o token já expirou
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expirado');
                    // enviada uma mensagem e o status de autenticação (falso)
                    return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
                } else {
                    console.log('Token inválido.');
                    // enviada uma mensagem e o status de autenticação (falso)
                    return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
                }
            }

						 // desestrutura o objeto JwtPayload e armazena as informações exp e id em variáveis 
            const { exp, id } = decoded as JwtPayload;

							// verifica se existe data de expiração ou o id no token que foi recebido pelo cliente
            if (!exp || !id) {
                console.log('Data de expiração ou ID não encontrada no token');
                // enviada uma mensagem e o status de autenticação (falso)
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

							// verifica se o tempo de validade do token foi expirado
            const currentTime = Math.floor(Date.now() / 1000);
            // valida se o horário atual for maior que o tempo de expiração registrado no token
            if (currentTime > exp) {
                console.log('Token expirado');
                // enviada uma mensagem e o status de autenticação (falso)
                return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
            }

            req.body.userId = id;

            next();
        });
    }
}