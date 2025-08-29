/**
 * Configuração de todas as rotas da interface web
 * Todas os endereços das páginas devem ser inseridas em APP_ROUTES
 * Essas rotas serão referenciadas no componente AppRoutes que está no arquivo routes.tsx
 * e em qualquer página que tenha um link que faça o direcionamento para outra página ou componente
 */
export const APP_ROUTES = {
    ROUTE_HOME: '/',
    ROUTE_LOGIN: '/login',
    ROUTE_ACESSO: "/acesso",
    ROUTE_CADASTRO_ESCOLHA: '/cadastro-escolha',
    
    // Rotas de cadastro dinâmico (com parâmetro redirect)
    ROUTE_CADASTRO: '/cadastro',

    
    // Rotas para listagem (tabelas)
    ROUTE_LISTAGEM_VOLUNTARIOS: '/voluntarios',
    ROUTE_LISTAGEM_PARTICIPACAO: '/participacao',
    ROUTE_LISTAGEM_TRABALHO: '/trabalho',
    ROUTE_LISTAGEM_MURAL: '/mural',
    ROUTE_TABELAS: '/tabelas', // Rota unificada para tabelas com abas

    // Rotas específicas para redirecionamento (opcional)
    ROUTE_CADASTRO_VOLUNTARIO: '/cadastro?redirect=voluntario',
    ROUTE_CADASTRO_TRABALHO: '/cadastro?redirect=trabalho',
    ROUTE_CADASTRO_PARTICIPACAO: '/cadastro?redirect=participacao',
}

/**
 * Configurações referente ao servidor da API
 * Todas as configurações referentes aos servidor web devem ser inseridas em SERVER_CFG
 * Todos os endereços configurados aqui são referentes as configurações do servidor web (backend)
 * Qualquer alteração nos endpoints, no endereço do servidor ou porta que forem feitas lá deve ser replicada aqui
 */
export const SERVER_CFG = {
    SERVER_URL: 'http://localhost:3332',
    API_ENDPOINTS: {
        CADASTRO_VOLUNTARIO: '/api/voluntarios',
        CADASTRO_TRABALHO: '/api/trabalhos',
        CADASTRO_PARTICIPACAO: '/api/participacoes'
    }
}