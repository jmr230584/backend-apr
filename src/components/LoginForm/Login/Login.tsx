import { useState, useContext } from 'react';
import '../Login/login.css';
import { AuthContext } from '../../../contexts/AuthContext'; // importa o contexto de autenticação


function Login() {
  // estados para armazenar os dados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // pega a função de login do contexto
  const { login } = useContext(AuthContext);

  // função executada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evita o recarregamento da página

    try {
      // chama o login com os dados digitados
      const sucesso = await login({ email, senha });

      if (sucesso) {
        // se login der certo, redireciona para a página inicial
        window.location.href = '/';
      } else {
        alert('Usuário ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro ao tentar realizar login:', error);
      alert('Erro ao fazer login. Verifique seus dados.');
    }
  };

  return (
    <div className="form-section">
      <form className="form-login" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* Campo para o email de usuário */}
       <label htmlFor="email">Email:</label>
          <input
             type="text"
             id="email"
             value={email}
             onChange={e => setEmail(e.target.value)}
             required
          />

        {/* Campo para a senha */}
        <div className="input-password">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {/* Botão para enviar o formulário */}
        <button type="submit" className="login-button">Login</button>

        {/* Frase com link para a página de cadastro */}
        <p className="texto-criar-conta">
          Não possui uma conta?{' '}
          <a href="/cadastro/voluntario" className="link-criar-conta">
            criar conta!
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
