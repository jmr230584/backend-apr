// Importa o módulo Router do Express para criar rotas
import { Router } from "express";
//Importa o multer para carregar dados ao servidor
import multer from "multer";
// Importa os controladores para manipular as requisições relacionadas a voluntários, participações e trabalhos
import { VoluntarioController } from "./controller/VoluntarioController";
import { ParticipacaoController } from "./controller/ParticipacaoController";
import { TrabalhoController } from "./controller/TrabalhoController";
import { MuralTrabalhosController } from "./controller/MuralTrabalhosController";
import {UsuarioController} from "./controller/UsuarioController";
import { Auth } from "./util/Auth";

// Cria um roteador para gerenciar as rotas
const router = Router();

// Salvar os arquivos na pasta uploads
const upload = multer({ dest: 'uploads/' }); 

// Rota principal que retorna uma mensagem de boas-vindas
router.get("/", (_req, res) => {
    res.json({ mensagem: "Bem-vindo ao sistema de voluntariado!" });
});

// Rotas para voluntários
router.get("/lista/voluntarios", VoluntarioController.todos); // Rota para listar todos os voluntários
router.post("/voluntario/novo", upload.single('fotoPerfil'), VoluntarioController.novo); // Rota para cadastrar um novo voluntário
router.put("/remover/voluntario", VoluntarioController.remover); // Rota para exluir um voluntário
router.put("/atualizar/voluntario/:idVoluntario", VoluntarioController.atualizar); // Rota para atualizar um novo voluntário


// Rotas para participações
router.get("/lista/participacao", ParticipacaoController.todos); // Rota para listar todas as participações
router.post("/participacao/novo", ParticipacaoController.novo); // Rota para cadastrar uma nova participação
router.put("/remover/participacao", ParticipacaoController.remover); // Rota para excluir uma participação
router.put("/atualizar/participacao/:idParticipacao", ParticipacaoController.atualizar); // Rota para atualizar uma participação

// Rotas para trabalhos
router.get("/lista/trabalho", TrabalhoController.todos); // Rota para listar todos os trabalhos
router.post("/trabalho/novo", TrabalhoController.novo); // Rota para cadastrar um novo trabalho
router.put("/remover/trabalho", TrabalhoController.remover); // Rota para excluir um trabalho
router.put("/atualizar/trabalho/:idTrabalho", TrabalhoController.atualizar); // Rota para atualizar um trabalho

// Rotas para o Mural de Trabalhos
router.get("/lista/trabalhos", MuralTrabalhosController.todos); // Rota para listar todos os trabalhos no mural
router.post("/trabalhoMural/novo", MuralTrabalhosController.novo); // Rota para cadastrar um novo trabalho no mural
router.put("/remover/trabalhoMural", MuralTrabalhosController.remover); // Rota para excluir um trabalho
router.put("/atualizar/muraltrabalho/:idMuralTrabalhos", MuralTrabalhosController.atualizar); // Rota para atualizar o mural de trabalhos finalizados

// Rotas do Usuário
router.get("/lista/usuario", UsuarioController.todos); // Rota para listar todos os usuários cadastrados
router.post('/usuario/novo', upload.single('imagemPerfil'), UsuarioController.criarUsuario);// Rota para cadastrar um novo usuario

// Rota de login
router.post('/login', (req, res, next) => {
  UsuarioController.login(req, res).catch(next);
}); // Rota de validação de usuário para login

// Exporta as rotas para serem usadas no servidor
export { router };