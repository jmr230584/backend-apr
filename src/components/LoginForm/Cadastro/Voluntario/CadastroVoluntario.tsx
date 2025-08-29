import { useState, ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Voluntario/CadastroVoluntario.css';
import Cabecalho from '../../../Cabecalho/Cabecalho';
import { SERVER_CFG } from '../../../../appConfig'; // usa os endpoints centralizados

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

  // Pega a aba ativa pela URL (usado para título e pós-cadastro)
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const redirect = (searchParams.get('redirect') || 'voluntario').toLowerCase();

  // Garantindo que a URL final do endpoint seja correta
  const endpoint = `${SERVER_CFG.SERVER_URL.replace(/\/$/, '')}${SERVER_CFG.API_ENDPOINTS.CADASTRO_VOLUNTARIO.startsWith('/') ? SERVER_CFG.API_ENDPOINTS.CADASTRO_VOLUNTARIO : '/' + SERVER_CFG.API_ENDPOINTS.CADASTRO_VOLUNTARIO}`;

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

    // Validação opcional do formato da data
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      alert('Data de nascimento inválida. Use o formato AAAA-MM-DD.');
      return;
    }

    // Cria o objeto FormData (permite enviar arquivos)
    const formData = new FormData();

if (fotoPerfil) { // garante que não é null
  formData.append('fotoPerfil', fotoPerfil); // nome igual ao esperado pelo Multer
}

formData.append('cpf', cpf);
formData.append('username', username);
formData.append('nome', nome);
formData.append('sobrenome', sobrenome);
formData.append('dataNascimento', dataNascimento);
formData.append('endereco', endereco);
formData.append('email', email);
formData.append('telefone', telefone);
formData.append('senha', senha);


    // Debug: Mostra os dados no console (exceto senha por segurança)
    console.log('Enviando cadastro de voluntário para:', endpoint);
    console.log('Dados do formulário (sem senha):', {
      cpf, nome, sobrenome, email, dataNascimento, endereco, telefone, username,
      imagemPerfil: fotoPerfil ? fotoPerfil.name : 'Sem imagem'
    });

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData, // não setar Content-Type manualmente para enviar o boundary corretamente
      });

      const respostaTexto = await res.text(); // Pega a resposta como texto
      let respostaJson: any = null;

      try {
        respostaJson = JSON.parse(respostaTexto); // Tenta converter para JSON se possível
      } catch {
        // Se não for JSON, deixa como texto puro
      }

      if (!res.ok) {
        console.error('Erro do servidor:', respostaJson || respostaTexto);
        alert(`Erro ao cadastrar: ${respostaJson?.mensagem || respostaTexto || 'Erro desconhecido'}`);
        return;
      }

      alert(respostaJson?.mensagem || 'Cadastro de voluntário realizado com sucesso!');

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
      const abaDestino = 'voluntario';
      navigate(`/tabelas?aba=${abaDestino}`);
    } catch (error) {
      console.error('Erro completo:', error);
      alert('Erro ao cadastrar: ' + (error as Error).message);
    }
  }

  return (
    <>
      <Cabecalho />
      <section className="form-section">
        {/* O título usa o redirect apenas como UX, mas o endpoint é fixo de voluntário */}
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
            Nome de Usuário
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
          />

          <button type="submit">CADASTRAR</button>
        </form>
      </section>
    </>
  );
}
