import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../appConfig';
import estilo from './Welcome.module.css';

import imagem1 from '../../assets/imagem1.png';
import imagem2 from '../../assets/imagem2.png';
import imagem33 from '../../assets/imagem3.gif';
import logotipo from '../../assets/logotipo.png';
import user from '../../assets/user.jpeg';

import { useAuth } from '../../contexts/AuthContext';

function Welcome(): JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated, avatarUrl } = useAuth();

  const handleUserImageClick = () => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.ROUTE_EDITAR_PERFIL);
    } else {
      navigate(APP_ROUTES.ROUTE_LOGIN);
    }
  };

  return (
    <main className={estilo.principal}>
      <div className={estilo.esquerda}>
        <div className={estilo.esquerda1}>
          <img src={logotipo} alt="Logotipo" />
        </div>

        <div className={estilo.esquerda2}>
          <p className={estilo.bemVindo}>Seja bem-vindo(a) ao Voluntaria Brasil.</p>
          <p className={estilo.msgInicial}>
            Você já pensou em doar um pouco do seu tempo para fazer a diferença na vida de alguém?
            No Voluntaria Brasil, você encontra oportunidades de voluntariado em diversas áreas,
            em todo o país, para todos os perfis e habilidades.
          </p>
        </div>

        <div className={estilo.esquerda3}>
          <h3>CONTATO:</h3>
          <p>Telefone/WhatsApp: (+55) 12 98937-3462</p>
          <p>E-mail: voluntariaBR@hotmail.com.br</p>
          <p>Site: www.voluntariabrasil.org</p>
          <p>Redes Sociais:</p>
          <p>Instagram: @voluntaria_brasil</p>
          <p>Facebook: fb.com/voluntariaBr</p>
        </div>
      </div>

      <div className={estilo.direita}>
        <img src={imagem1} alt="imagem1" />
        <img src={imagem2} alt="imagem2" />

        <img
          src={avatarUrl || user}
          alt="Imagem do usuário"
          className={estilo.userImage}
          onClick={handleUserImageClick}
          style={{ cursor: 'pointer' }}
          title={isAuthenticated ? 'Editar Perfil' : 'Cadastrar-se'}
        />
      </div>

      <img src={imagem33} alt="imagem3" className={estilo.imagem33} />

      <div className={estilo.botaoContainer}>
        <button
          className={estilo.botaoSaibaMais}
          onClick={() => navigate(APP_ROUTES.ROUTE_SOBRE_PROJETOS)}
        >
          Saiba Mais
        </button>
      </div>
    </main>
  );
}

export default Welcome;
