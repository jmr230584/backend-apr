import { useState, ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Cadastro/cadastro.css';
import Cabecalho from '../../Cabecalho/Cabecalho';

export default function Cadastro() {
  // Estados para armazenar os dados do formulário
  const [cpf, setCpf] = useState('');
  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState(''); // Adicionado estado para senha (apenas front)
  const [confirmarSenha, setConfirmarSenha] = useState(''); // Adicionado confirmação
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [erroSenha, setErroSenha] = useState(''); // Estado para erro de senha

  // Pega a aba ativa pela URL
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || 'voluntario'; // voluntario, trabalho ou participacao

  // Função para capturar a foto do perfil
  function handleFotoChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setFotoPerfil(event.target.files[0]);
    }
  }

  // Função que envia os dados para o backend
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Validação da senha (APENAS FRONTEND)
    if (senha !== confirmarSenha) {
      setErroSenha('As senhas não coincidem!');
      return;
    }

    if (senha.length < 6) {
      setErroSenha('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const formData = new FormData();
    formData.append('cpf', cpf);
    formData.append('username', username);
    formData.append('nome', nome);
    formData.append('sobrenome', sobrenome);
    formData.append('dataNascimento', dataNascimento);
    formData.append('endereco', endereco);
    formData.append('email', email);
    formData.append('telefone', telefone);
    formData.append('senha', senha);
    // NOTA: Não estamos enviando a senha pois o backend não tem esse campo ainda
    if (fotoPerfil) {
      formData.append('fotoPerfil', fotoPerfil);
    }

    // Debug: Mostra os dados no console (exceto senha por segurança)
    console.log('Dados do formulário (sem senha):', {
      cpf, nome, sobrenome, email, 
      dataNascimento, endereco, telefone
    });

    // Define a rota correta com base na aba ativa
    const endpoint = `http://localhost:3332/usuario/novo`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro do servidor:', errorText);
        throw new Error(errorText || 'Erro ao cadastrar');
      }

      alert('Cadastro realizado com sucesso!');

      // Limpa os campos (incluindo os novos campos de senha)
      setCpf('');
      setUsername('');
      setNome('');
      setSobrenome('');
      setDataNascimento('');
      setEndereco('');
      setEmail('');
      setTelefone('');
      setSenha('');
      setConfirmarSenha('');
      setFotoPerfil(null);
      setErroSenha('');

      // Redireciona para a aba correspondente na tela de tabelas
      navigate(`/tabelas?aba=${redirect}`);
    } catch (error) {
      console.error('Erro completo:', error);
      alert('Erro ao cadastrar: ' + (error as Error).message);
    }
  }

  return (
    <>
      <Cabecalho />
      <section className="form-section">
        <h3>Cadastro de {redirect.charAt(0).toUpperCase() + redirect.slice(1)}</h3>
        
        <form className="form-login" onSubmit={handleSubmit}>
          <label>
            CPF
            <input
              type="text"
              placeholder="Informe o seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </label>

          <label>
            Nome de usuário
           <input
             type="text"
             placeholder="Crie um nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>


          <label>
            Nome
            <input
              type="text"
              placeholder="Informe o seu primeiro nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>

          <label>
            Sobrenome
            <input
              type="text"
              placeholder="Informe o seu sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              required
            />
          </label>

          <label>
            Data de Nascimento
            <input
              type="date"
              placeholder="dd/mm/aaaa"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </label>

          <label>
            Endereço
            <input
              type="text"
              placeholder="Informe o seu endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              placeholder="Informe o seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Telefone
            <input
              type="tel"
              placeholder="Informe o seu número de telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </label>
          
          <label>
            Senha 
            <input
              type="password"
              placeholder="Crie uma senha (mínimo 6 caracteres)"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErroSenha(''); // Limpa erro ao digitar
              }}
              required
            />
          </label>

          <label>
            Confirmar Senha
            <input
              type="password"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(e) => {
                setConfirmarSenha(e.target.value);
                setErroSenha(''); // Limpa erro ao digitar
              }}
              required
            />
          </label>

          {/* Mensagem de erro da senha */}
          {erroSenha && <div className="erro-senha">{erroSenha}</div>}

          <label htmlFor="fotoPerfil" className="upload-label">
            {fotoPerfil ? fotoPerfil.name : 'Escolha sua foto de perfil'}
          </label>
          <input
            id="fotoPerfil"
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            required
          />

          <button type="submit">CADASTRAR</button>
        </form>
      </section>
    </>
  );
}