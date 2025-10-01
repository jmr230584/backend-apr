import express from "express"; // Importa o framework Express
import cors from "cors"; // Importa o middleware Cors
import { router } from './routes'; // Importa as rotas do sistema
import path from 'path'; // Importa o módulo path para trabalhar com diretórios

const server = express(); // Cria uma instância do servidor Express

server.use(cors()); // Habilita o uso do middleware Cors para lidar com CORS

// Serve os arquivos da pasta uploads
server.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Aplica express.json() **somente em rotas que não são de upload**
server.use((req, res, next) => {
  if (!req.path.startsWith('/voluntario/novo')) {
    express.json()(req, res, next); // Permite parsing de JSON para outras rotas
  } else {
    next(); // Pula para a rota de upload sem interferir no multer
  }
});

server.use(router); // Habilita o uso das rotas do arquivo routes.ts

export { server }; // Exporta a instância do servidor
