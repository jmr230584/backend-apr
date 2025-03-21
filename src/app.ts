// Importa o módulo 'server' que contém a configuração do servidor
import { server } from './server';

// Importa a classe DatabaseModel que gerencia a conexão com o banco de dados
import { DatabaseModel } from './model/DatabaseModel';

// Define a porta em que o servidor irá rodar
const port: number = 3333;

// Testa a conexão com o banco de dados antes de iniciar o servidor
new DatabaseModel().testeConexao().then((resdb) => {
  // Verifica se a conexão com o banco de dados foi bem-sucedida
  if (resdb) {
    // Se a conexão foi bem-sucedida, inicia o servidor
    server.listen(port, () => {
      console.clear(); // Limpa o console para melhorar a visualização
      console.log(`Endereço do servidor http://localhost:${port}`); // Exibe o endereço do servidor
    });
  } else {
    // Se a conexão com o banco de dados falhou, exibe uma mensagem de erro
    console.log(`Erro ao conectar com o banco de dados.`);
  }
});