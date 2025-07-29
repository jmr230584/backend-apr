// Importa a biblioteca 'pg' (node-postgres) para interagir com o banco de dados PostgreSQL
import pg from 'pg';

// Importa a biblioteca 'dotenv' para carregar variáveis de ambiente a partir de um arquivo .env
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Classe que representa o modelo de banco de dados.
 * Responsável por gerenciar a conexão com o PostgreSQL.
 */
export class DatabaseModel {
    
    /**
     * Configuração para conexão com o banco de dados.
     * Esse objeto contém os detalhes necessários para se conectar ao PostgreSQL.
     */
    private _config: object;

    /**
     * Pool de conexões com o banco de dados.
     * O pool gerencia múltiplas conexões simultâneas de forma eficiente.
     */
    private _pool: pg.Pool;

    /**
     * Cliente de conexão com o banco de dados.
     * Diferente do pool, o cliente é uma conexão única e direta ao banco.
     */
    private _client: pg.Client;
    static query: any;

    /**
     * Construtor da classe DatabaseModel.
     * Inicializa as configurações, o pool de conexões e o cliente de conexão.
     */
    constructor() {
        // Define a configuração para conexão com o banco de dados, utilizando variáveis de ambiente
        this._config = {
            user: process.env.DB_USER,       // Nome do usuário do banco de dados
            host: process.env.DB_HOST,       // Endereço do servidor do banco de dados
            database: process.env.DB_NAME,   // Nome do banco de dados
            password: process.env.DB_PASSWORD, // Senha do usuário do banco de dados
            port: process.env.DB_PORT,       // Porta de conexão com o banco
            max: 10,                         // Número máximo de conexões no pool
            idleTimoutMillis: 10000          // Tempo máximo de inatividade antes de fechar uma conexão (10 segundos)
        };

        // Cria um pool de conexões para otimizar a performance e permitir múltiplas conexões simultâneas
        this._pool = new pg.Pool(this._config);

        // Cria um cliente de conexão individual para interações diretas com o banco
        this._client = new pg.Client(this._config);
    }

    /**
     * Método para testar a conexão com o banco de dados.
     * @returns **true** se a conexão for bem-sucedida, **false** se houver falha.
     */
    public async testeConexao() {
        try {
            // Tenta estabelecer a conexão com o banco de dados
            await this._client.connect();
            console.log('Database connected!');

            // Encerra a conexão com o banco de dados após o teste
            this._client.end();
            return true;
        } catch (error) {
            // Em caso de erro, exibe mensagens de erro no console
            console.log('Error to connect database X( ');
            console.log(error);

            // Encerra a conexão para evitar problemas de conexão pendente
            this._client.end();
            return false;
        }
    }

    /**
     * Getter para acessar o pool de conexões.
     * Isso permite que outras partes da aplicação utilizem o pool para executar consultas ao banco.
     */
    public get pool() {
        return this._pool;
    }
}
