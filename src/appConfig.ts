/**
 * Configuração de todas as rotas da interface web
 * Todas os endereços das páginas devem ser inseridas em APP_ROUTES
 * Essas rotas serão referenciadas no componente AppRoutes que está no arquivo routes.tsx
 * e em qualquer página que tenha um link que faça o direcionamento para outra página ou componente
 */
export const APP_ROUTES = {
    ROUTE_HOME: '/',
    ROUTE_LOGIN: '/login',
    ROUTE_ACESSO: '/acesso',
    ROUTE_CADASTRO_ESCOLHA: '/cadastro-escolha',
  
    // Cadastros separados
    ROUTE_CADASTRO_VOLUNTARIO: '/cadastro/voluntario',
    ROUTE_CADASTRO_TRABALHO: '/cadastro/trabalho',
    ROUTE_CADASTRO_PARTICIPACAO: '/cadastro/participacao',
  
    // Rotas de listagem
    ROUTE_LISTAGEM_VOLUNTARIOS: '/voluntarios',
    ROUTE_LISTAGEM_PARTICIPACAO: '/participacao',
    ROUTE_LISTAGEM_TRABALHO: '/trabalho',
    ROUTE_LISTAGEM_MURAL: '/mural',
    ROUTE_TABELAS: '/tabelas',
  
    ROUTE_SOBRE_PROJETOS: '/sobre-projetos',
    ROUTE_EDITAR_PERFIL: '/editar-perfil',
  };
  
  export const SERVER_CFG = {
    SERVER_URL: 'http://localhost:3332',
    API_ENDPOINTS: {
      CADASTRO_VOLUNTARIO: '/voluntario/novo',
      CADASTRO_TRABALHO: '/trabalho/novo',
      CADASTRO_PARTICIPACAO: '/participacao/novo',
    }
  };
  