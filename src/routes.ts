import { Request, Response, Router } from "express";
import { VoluntarioController } from "./controller/VoluntarioController";
import { StatusController } from "./controller/StatusController";
import { TrabalhoController } from "./controller/TrabalhoController";
// Cria um roteador
const router = Router();

// Criando uma rota principal para a aplicação
router.get("/", (req: Request, res: Response) => {
    res.json({ mensagem: "Bem-vindo ao sistema de voluntariado!" });
});

/* 
* ROTAS PARA VOLUNTÁRIOS
*/ 
// Rota para listar os voluntários
router.get("/lista/voluntarios", VoluntarioController.listarTodos);


/* 
* ROTAS PARA StatusS
*/ 
// Rota para listar os Statuss
router.get("/lista/statuss", StatusController.todos);


/* 
* ROTAS PARA trabalhos
*/ 
// Rota para listar as trabalhos
router.get("/lista/trabalho", TrabalhoController.todos);


// Exportando as rotas
export { router };
