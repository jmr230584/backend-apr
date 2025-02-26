import express from 'express';
import cors from 'cors';
import { router } from './routes';

// Cria o servidor express
const server = express();
// Configura o servidor para aceitar requisições de outros domínios
server.use(cors());
// Configura o servidor para aceitar requisições no formato JSON
server.use(express.json());

// Configurando as rotas no servidor
server.use(router);

// Exporta o servidor
export { server };