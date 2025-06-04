// Importa o módulo 'express' para criar o servidor
import express from "express";

// Importa o módulo 'cors' para permitir requisições de outros domínios
import cors from "cors";

// Importa as rotas definidas no arquivo './routes'
import { router } from "./routes";

import path from 'path';

// Cria o servidor express
const server = express();

// Configura o servidor para aceitar requisições de outros domínios
server.use(cors());

// Configura o servidor para aceitar requisições no formato JSON
server.use(express.json());

// Configura as rotas no servidor
server.use(router);

server.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));  // Serve os arquivos da pasta uploads

// Exporta o servidor para ser utilizado em outros arquivos
export { server };

