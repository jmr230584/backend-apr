import { APP_ROUTES } from '../../appConfig';
import '../CadastroEscolha/CadastroEcolha.css';
import Cabecalho from '../Cabecalho/Cabecalho';

export default function CadastroEscolha() {
  return (
    <>
      <Cabecalho />
      <div className="cadastro-escolha-container">
        <h1>Escolha o tipo de cadastro</h1>

        {/* Linha dos botões */}
        <div className="linha-botoes">
          <a href={APP_ROUTES.ROUTE_CADASTRO_VOLUNTARIO} className="botao-cadastro">
            Voluntário
          </a>
          <a href={APP_ROUTES.ROUTE_CADASTRO_TRABALHO} className="botao-cadastro">
            Trabalho
          </a>
          <a href={APP_ROUTES.ROUTE_CADASTRO_PARTICIPACAO} className="botao-cadastro">
            Participação
          </a>
        </div>

        {/* Linha das descrições */}
        <div className="linha-descricoes">
          <div className="bloco-descricao">
            <p>
            Inscreva-se para participar de ações e projetos sociais!
            </p>
          </div>
          <div className="bloco-descricao">
            <p>
            Cadastre novos trabalhos e organize projetos da comunidade!
            </p>
          </div>
          <div className="bloco-descricao">
            <p>
            Inscreva-se para participar de trabalhos e contribuições com a comunidade!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
