import { JSX } from 'react';
import estilo from './Cabecalho.module.css';
import logotipo from '../../assets/logotipo.png';
import { APP_ROUTES } from '../../appConfig';

// Componente funcional do cabeçalho da aplicação
function Cabecalho(): JSX.Element {
  return (
    // Elemento header com estilo personalizado
    <header className={estilo.cabecalho}>
      
      {/* Logo no canto esquerdo, link para a home */}
      <a href={APP_ROUTES.ROUTE_HOME} className={estilo.imgLogo}>
        <img src={logotipo} alt="logotipo" />
      </a>

      {/* Navegação principal no canto direito */}
      <nav className={estilo.links}>

        <a href={APP_ROUTES.ROUTE_HOME}>Início</a>
        <a href={APP_ROUTES.ROUTE_LISTAGEM_MURAL}>Mural</a>

        {/* Menu dropdown para acesso (login e cadastro) */}
        <div className={estilo.dropdown}>
          <button className={estilo.dropbtn}>Acesso</button>
          <div className={estilo.dropdownContent}>
            <a href={APP_ROUTES.ROUTE_LOGIN}>LOGIN</a>
            <a href={APP_ROUTES.ROUTE_CADASTRO_ESCOLHA}>CADASTRO</a>
            
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Cabecalho;
