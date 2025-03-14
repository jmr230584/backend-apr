import { Router } from "express";
import { VoluntarioController } from "./controller/VoluntarioController";
import { StatusController } from "./controller/StatusController";
import { TrabalhoController } from "./controller/TrabalhoController";

// Cria um roteador
const router = Router();

// Rota principal
router.get("/", (req, res) => {
    res.json({ mensagem: "Bem-vindo ao sistema de voluntariado!" });
});

// Rotas para voluntários
router.get("/lista/voluntarios", VoluntarioController.todos);
router.post("/voluntario/novo", VoluntarioController.novo); 


// Rotas para status
router.get("/lista/status", StatusController.todos);
router.post("/statusTrabalho/novo", StatusController.novo); 


// Rotas para trabalhos
router.get("/lista/trabalho", TrabalhoController.todos);
router.post("/trabalho/novo", TrabalhoController.novo);

// Exporta as rotas
export { router };