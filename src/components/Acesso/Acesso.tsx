import './Acesso.css';
import { APP_ROUTES } from '../../appConfig';

export default function Acesso() {
  return (
    <div className="container-acesso">
      <h1>Bem-vindo(a)!</h1>
      <p>Escolha uma opção para continuar:</p>

      <div className="botoes-acesso">
        <a href={APP_ROUTES.ROUTE_LOGIN} className="botao">Login</a>
        <a href={APP_ROUTES.ROUTE_CADASTRO_ESCOLHA} className="botao">Cadastro</a>
      </div>
    </div>
  );
}