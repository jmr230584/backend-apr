// Imports
import { Router } from "express";
import multer from "multer";
import { VoluntarioController } from "./controller/VoluntarioController";
import { ParticipacaoController } from "./controller/ParticipacaoController";
import { TrabalhoController } from "./controller/TrabalhoController";
import { MuralTrabalhosController } from "./controller/MuralTrabalhosController";
import { AuthController } from "./controller/AuthController";

// Cria um roteador para gerenciar as rotas
const router = Router();

// Salvar os arquivos na pasta uploads
const upload = multer({ dest: 'uploads/' }); 

// Rota principal
router.get("/", (_req, res) => {
    res.json({ mensagem: "Bem-vindo ao sistema de voluntariado!" });
});

// Login de voluntário
router.post("/login", AuthController.login);

// Rotas para voluntários
router.get("/lista/voluntarios", VoluntarioController.todos);
router.post("/voluntario/novo", upload.single('imagemPerfil'), VoluntarioController.cadastrar);
router.put("/remover/voluntario", VoluntarioController.remover);
router.put("/atualizar/voluntario/:idVoluntario", VoluntarioController.atualizar);

// Rotas para participações
router.get("/lista/participacao", ParticipacaoController.todos);
router.post("/participacao/novo", ParticipacaoController.novo);
router.put("/remover/participacao", ParticipacaoController.remover);
router.put("/atualizar/participacao/:idParticipacao", ParticipacaoController.atualizar);

// Rotas para trabalhos
router.get("/lista/trabalho", TrabalhoController.todos);
router.post("/trabalho/novo", TrabalhoController.novo);
router.put("/remover/trabalho", TrabalhoController.remover);
router.put("/atualizar/trabalho/:idTrabalho", TrabalhoController.atualizar);

// Rotas para o Mural de Trabalhos
router.get("/lista/trabalhos", MuralTrabalhosController.todos);
router.post("/trabalhoMural/novo", MuralTrabalhosController.novo);
router.put("/remover/trabalhoMural", MuralTrabalhosController.remover);
router.put("/atualizar/muraltrabalho/:idMuralTrabalhos", MuralTrabalhosController.atualizar);

export { router };
