// Importa o módulo Router do Express para criar rotas
import { Router } from "express";

// Importa os controladores para manipular as requisições relacionadas a voluntários, participações e trabalhos
import { VoluntarioController } from "./controller/VoluntarioController";
import { ParticipacaoController } from "./controller/ParticipacaoController";
import { TrabalhoController } from "./controller/TrabalhoController";

// Cria um roteador para gerenciar as rotas
const router = Router();

// Rota principal que retorna uma mensagem de boas-vindas
router.get("/", (req, res) => {
    res.json({ mensagem: "Bem-vindo ao sistema de voluntariado!" });
});

// Rotas para voluntários
router.get("/lista/voluntarios", VoluntarioController.todos); // Rota para listar todos os voluntários
router.post("/voluntario/novo", VoluntarioController.novo); // Rota para cadastrar um novo voluntário

// Rotas para participações
router.get("/lista/participacao", ParticipacaoController.todos); // Rota para listar todas as participações
router.post("/participacao/novo", ParticipacaoController.novo); // Rota para cadastrar uma nova participação

// Rotas para trabalhos
router.get("/lista/trabalho", TrabalhoController.todos); // Rota para listar todos os trabalhos
router.post("/trabalho/novo", TrabalhoController.novo); // Rota para cadastrar um novo trabalho

// Exporta as rotas para serem usadas no servidor
export { router };