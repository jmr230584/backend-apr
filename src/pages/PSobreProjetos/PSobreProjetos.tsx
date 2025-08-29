import React from 'react';
import './PSobreProjetos.css';
import Cabecalho from '../../components/Cabecalho/Cabecalho';
import { useNavigate } from 'react-router-dom';

import imgAnaJulia from '../../assets/voluntariabrasil.jpg';
import imgTartaruga from '../../assets/voluntariabrasil2.jpg';
import imgLimpeza from '../../assets/limpeza.jpg';
import imgBoto from '../../assets/botos.jpeg';
import imgIndigena from '../../assets/saude.jpeg';

const PSobreProjetos: React.FC = () => {
  const navigate = useNavigate();

  const handleMuralClick = () => {
    navigate('/mural#mural-voluntario');
  };

  const handleCadastroClick = () => {
    navigate('/cadastro');
  };

  return (
    <div className="pagina-projetos">
      <header className="cabecalho-pagina">
        <Cabecalho />
      </header>

      <div className="sobre-nos-container">
        <h2 className="titulo-secao">SOBRE NÓS:</h2>
        
        <div className="conteudo-flex">
          <div className="lado-esquerdo">
            <div className="retangulo-imagem">
              <img src={imgAnaJulia} alt="Ana Julia da Silva" />
            </div>
            <div className="retangulo-info">
              <p>- Recife - 10/12/14</p>
              <p>- Ana Julia da Silva - 19 anos</p>
              <p>O Voluntaria Brasil nasceu do desejo de conectar pessoas dispostas a fazer a diferença. Nosso objetivo é fortalecer a rede de solidariedade no Brasil, tomando mais acessível e organizada a participação de quem dessa ajudar.</p>
            </div>
          </div>

          <div className="lado-direito">
            <h3 className="titulo-projeto">Voluntariado - Recife 23/11/2014</h3>
            <img className="imagem-projeto" src={imgTartaruga} alt="Projeto tartarugas" />
            <p>Em 23 de novembro de 2014, o Projeto "Maekhar" foi lançado com o intuito de preservar uma das espécies mais ameaçadas e emblemáticas da fauna marinha: as tartarugas marinhas.</p>
          </div>
        </div>

        <div className="botao-container">
          <button className="botao-mural" onClick={handleMuralClick}>MURAL DE TRABALHOS</button>
        </div>
      </div>

      <div className="secao-projetos">
        <h2 className="titulo-secao">PROJETOS:</h2>
        
        <div className="grade-projetos">
          <div className="card-projeto">
            <img className="imagem-card" src={imgLimpeza} alt="Limpeza de rios" />
            <div className="texto-projeto">
              <p>Ação de limpeza de rios e lagos.</p>
              <p>Em 2020 foi criada uma missão voluntária, a poluição vem consumindo nossos rios e mares, com a sua ajuda podemos fazer um futuro melhor!</p>
            </div>
            <button className="botao-inscrever" onClick={handleCadastroClick}>INSCREVA-SE</button>
          </div>

          <div className="card-projeto">
            <img className="imagem-card" src={imgBoto} alt="Monitoramento de bois" />
            <div className="texto-projeto">
              <p>Ajude biólogos no monitoramento das populações de bois!</p>
              <p>Coletando dados sobre comportamento, alimentação e migração. Sua ajuda faz a diferença!</p>
            </div>
            <button className="botao-inscrever" onClick={handleCadastroClick}>INSCREVA-SE</button>
          </div>

          <div className="card-projeto">
            <img className="imagem-card" src={imgIndigena} alt="Saúde indígena" />
            <div className="texto-projeto">
              <p>Cuidando da saúde indígena.</p>
              <p>Um trabalho importante é a práticas tradicionais de saúde, respeitando e aprendendo com indígenas para o cuidado e cura.</p>
            </div>
            <button className="botao-inscrever" onClick={handleCadastroClick}>INSCREVA-SE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSobreProjetos;
