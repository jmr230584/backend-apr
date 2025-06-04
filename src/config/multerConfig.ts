import multer from 'multer'; // Importa o Multer, responsável por lidar com uploads
import path from 'path'; // Módulo para trabalhar com caminhos de arquivos
import crypto from 'crypto'; // Módulo para gerar valores aleatórios

// Define a configuração de armazenamento dos arquivos
const storage = multer.diskStorage({
  // Define o diretório onde os arquivos enviados serão salvos
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads')); // Caminho absoluto até a pasta "uploads"
  },

  // Define o nome do arquivo que será salvo
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(6).toString('hex'); // Gera um hash aleatório de 6 bytes
    const ext = path.extname(file.originalname); // Extrai a extensão original do arquivo

    // Tenta obter o UUID do usuário da requisição
    const uuid = (req.body?.uuid || req.params?.uuid || req.query?.uuid || 'sem-uuid');

    // Cria o nome final do arquivo: uuid-hash-nomeOriginal.ext
    const filename = `${uuid}-${hash}-${file.originalname}`;

    cb(null, filename); // Retorna o nome para o multer salvar
  }
});

// Cria o middleware de upload com a configuração de armazenamento definida
const upload = multer({ storage });

export default upload; // Exporta o middleware para ser usado nas rotas