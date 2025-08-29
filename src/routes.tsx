import { JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { APP_ROUTES } from './appConfig';

// Páginas
import PHome from './pages/PHome/PHome';
import PLogin from './pages/PLogin/PLogin';
import PListaVoluntarios from './pages/PListagem/PListaVoluntarios/PListaVoluntario';
import PListagemTrabalhos from './pages/PListagem/PlistaTrabalhos/PListaTrabalho';
import PListaParticipacao from './pages/PListagem/PListParticipacao/PListaParticipacao';
import PListagemMural from './pages/PListagem/PListaMural/PListaMural';
import PSobreProjetos from './pages/PSobreProjetos/PSobreProjetos';
import UserPerfil from './components/UserPerfil/UserPerfil';

// Componentes
import Acesso from './components/Acesso/Acesso';
import CadastroEscolha from './components/CadastroEscolha/CadastroEscolha';
import CadastroVoluntario from './components/LoginForm/Cadastro/Voluntario/CadastroVoluntario'; 
import CadastroParticipacao from './components/LoginForm/Cadastro/Participacao/CadastroParticipacao';
import CadastroTrabalho from './components/LoginForm/Cadastro/Trabalho/CadastroTrabalho';
import TabelasAbas from './components/Tabelas/TabelaAba';

/**
 * Componente que irá lidar com todas as rotas da aplicação
 * @returns Um componente web para lidar com as rotas
 */
function AppRoutes(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.ROUTE_HOME} element={<PHome />} />
        <Route path={APP_ROUTES.ROUTE_ACESSO} element={<Acesso />} />
        <Route path={APP_ROUTES.ROUTE_LOGIN} element={<PLogin />} />

        {/* Fluxo de cadastro */}
        <Route path={APP_ROUTES.ROUTE_CADASTRO_ESCOLHA} element={<CadastroEscolha />} />
        <Route path={APP_ROUTES.ROUTE_CADASTRO_VOLUNTARIO} element={<CadastroVoluntario />} />
        <Route path={APP_ROUTES.ROUTE_CADASTRO_TRABALHO} element={<CadastroTrabalho />} />
        <Route path={APP_ROUTES.ROUTE_CADASTRO_PARTICIPACAO} element={<CadastroParticipacao />} />

        {/* Rotas de listagem */}
        <Route path={APP_ROUTES.ROUTE_LISTAGEM_VOLUNTARIOS} element={<PListaVoluntarios />} />
        <Route path={APP_ROUTES.ROUTE_LISTAGEM_PARTICIPACAO} element={<PListaParticipacao />} />
        <Route path={APP_ROUTES.ROUTE_LISTAGEM_TRABALHO} element={<PListagemTrabalhos />} />
        <Route path={APP_ROUTES.ROUTE_LISTAGEM_MURAL} element={<PListagemMural />} />

        <Route path={APP_ROUTES.ROUTE_TABELAS} element={<TabelasAbas />} />
        <Route path={APP_ROUTES.ROUTE_SOBRE_PROJETOS} element={<PSobreProjetos />} />
        <Route path="/perfil" element={<UserPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;