// Importa hooks do React para manipular estado e efeitos
import { useState } from 'react';
import axios from 'axios';
import '../Trabalho/CadastroTrabalho.css'; // importa o CSS específico
import Cabecalho from '../../../Cabecalho/Cabecalho'; // importa corretamente o componente do cabeçalho
import { useNavigate } from 'react-router-dom'; // importa o hook useNavigate

function CadastroTrabalho() {
  // Hook para navegação
  const navigate = useNavigate();

  // Estados para os campos do formulário de trabalho
  const [nomeTrabalho, setNomeTrabalho] = useState('');
  const [ongResponsavel, setOngResponsavel] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação extra (não deve ser necessária com o required, mas garante)
    if (!nomeTrabalho || !ongResponsavel || !localizacao || !dataInicio || !dataTermino) {
      alert('Preencha todos os campos.');
      return;
    }

    // Mostra no console os dados enviados
    console.log('Dados enviados:', {
      nome_trabalho: nomeTrabalho,
      ong_responsavel: ongResponsavel,
      localizacao: localizacao,
      data_inicio: dataInicio,
      data_termino: dataTermino,
    });

    try {
      // Faz a requisição POST para o backend
      await axios.post('http://localhost:3332/trabalho/novo', {
        nome_trabalho: nomeTrabalho,
        ong_responsavel: ongResponsavel,
        localizacao: localizacao,
        data_inicio: dataInicio,
        data_termino: dataTermino,
      });

      alert('Trabalho cadastrado com sucesso!');

      // Limpa os campos após o envio
      setNomeTrabalho('');
      setOngResponsavel('');
      setLocalizacao('');
      setDataInicio('');
      setDataTermino('');

      // Redireciona para a tabela de trabalhos automaticamente
      navigate('/tabelas?aba=trabalho');

    } catch (error) {
      alert('Erro ao cadastrar trabalho');
      console.error('Erro ao cadastrar trabalho:', error);
    }
  };

  return (
    <>
      {/* Componente de cabeçalho */}
      <Cabecalho />

      <div className="cadastro-trabalho-container">
        {/* Título do formulário */}
        <h2>Cadastro de Trabalho</h2>

        {/* Formulário de cadastro */}
        <form onSubmit={handleSubmit}>
          {/* Campo: Nome do Trabalho */}
          <div className="form-group">
            <label>Nome do trabalho:</label>
            <input
              type="text"
              placeholder="Informe o nome do seu trabalho"
              value={nomeTrabalho}
              onChange={(e) => setNomeTrabalho(e.target.value)}
              required
            />
          </div>

          {/* Campo: ONG Responsável */}
          <div className="form-group">
            <label>ONG Responsável:</label>
            <select
              value={ongResponsavel}
              onChange={(e) => setOngResponsavel(e.target.value)}
              required
            >
              <option value="">Selecione a ONG</option>
              <option value="Esperança Viva">Esperança Viva</option>
              <option value="Patas Felizes">Patas Felizes</option>
              <option value="Mãos que curam">Mãos que curam</option>
              <option value="H2Somos">H2Somos</option>
              <option value="Verde para o Futuro">Verde para o Futuro</option>
            </select>
          </div>

          {/* Campo: Localização */}
          <div className="form-group">
            <label>Localização:</label>
            <select
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              required
            >
              <option value="">Selecione a cidade</option>
              <option value="São Paulo - SP">São Paulo - SP</option>
              <option value="Rio de Janeiro - RJ">Rio de Janeiro - RJ</option>
              <option value="Belo Horizonte - BH">Belo Horizonte - BH</option>
              <option value="Rio Grande do Sul - RS">Rio Grande do Sul - RS</option>
              <option value="Curitiba - PR">Curitiba - PR</option>
            </select>
          </div>

          {/* Campo: Data de Início */}
          <div className="form-group">
            <label>Data de Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </div>

          {/* Campo: Data de Término */}
          <div className="form-group">
            <label>Data de Término:</label>
            <input
              type="date"
              value={dataTermino}
              onChange={(e) => setDataTermino(e.target.value)}
              required
            />
          </div>

          {/* Botão de envio */}
          <button type="submit">Cadastrar Trabalho</button>
        </form>
      </div>
    </>
  );
}

export default CadastroTrabalho;
