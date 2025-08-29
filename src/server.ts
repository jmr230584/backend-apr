import express from "express"; // Importa o framework Express
import cors from "cors"; // Importa o middleware Cors
import { router } from './routes';
import path from 'path';

const server = express(); // Cria uma instância do servidor Express
server.use(express.json()); // Habilita o uso de JSON no servidor
server.use(cors()); // Habilita o uso do middleware Cors para lidar com CO
server.use(router); // Habilita o uso das rotas do arquivo routes.ts
server.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));  // Serve os arquivos da pasta uploads

export { server }