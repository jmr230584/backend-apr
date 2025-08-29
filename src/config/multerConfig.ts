import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Função auxiliar para nome aleatório
function gerarNomeAleatorio(tamanho: number = 16): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indice);
  }
  return resultado;
}

// Upload genérico
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    const uuid = (req.body?.uuid || req.params?.uuid || req.query?.uuid || 'sem-uuid');
    const filename = `${uuid}-${hash}-${file.originalname}`;
    cb(null, filename);
  }
});
export const upload = multer({ storage });

// Upload de capa com nome aleatório
const storageCapa = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads/cover'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const nomeImagem = `${gerarNomeAleatorio(16)}${ext}`;
    req.body.nomeImagem = nomeImagem; // ainda disponível para o controller
    cb(null, nomeImagem);
  }
});
export const uploadCapa = multer({ storage: storageCapa });