import { APP_ROUTES } from '../../appConfig';
import '../CadastroEscolha/CadastroEcolha.css';
import Cabecalho from '../Cabecalho/Cabecalho';

export default function CadastroEscolha() {
  return (
    <>
      <Cabecalho />
      <div className="cadastro-escolha-container">
        <h1>Escolha o tipo de cadastro</h1>
        <div className="botoes-cadastro">
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
      </div>
    </>
  );
}
