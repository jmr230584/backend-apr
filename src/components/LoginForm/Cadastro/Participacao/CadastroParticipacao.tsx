import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Participacao/CadastroParticipacao.css';
import Cabecalho from '../../../Cabecalho/Cabecalho';

export default function CadastroParticipacao() {
  // Estados para os campos da participação
  const [idTrabalho, setIdTrabalho] = useState('');
  const [idVoluntario, setIdVoluntario] = useState('');
  const [quantidadeVagas, setQuantidadeVagas] = useState('');
  const [duracao, setDuracao] = useState('');
  const [atividadeTrabalho, setAtividadeTrabalho] = useState('');

  const navigate = useNavigate();

  // Envia os dados para o backend
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Validação para garantir que todos os campos estão preenchidos
    if (
      !idTrabalho.trim() ||
      !idVoluntario.trim() ||
      !quantidadeVagas.trim() ||
      !duracao.trim() ||
      !atividadeTrabalho.trim()
    ) {
      alert('Preencha todos os campos antes de enviar.');
      return;
    }

    const novaParticipacao = {
      idTrabalho: Number(idTrabalho), // Converte para número
      idVoluntario: Number(idVoluntario), // Converte para número
      quantidadeVagas: Number(quantidadeVagas), // Converte para número
      duracao: duracao.trim(), // Remove espaços extras
      atividadeTrabalho: atividadeTrabalho.trim(), // Remove espaços extras
    };

    try {
      const res = await fetch('http://localhost:3332/participacao/novo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaParticipacao),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro do servidor:', errorText);
        throw new Error(errorText || 'Erro ao cadastrar participação');
      }

      alert('Participação cadastrada com sucesso!');

      // Limpa os campos
      setIdTrabalho('');
      setIdVoluntario('');
      setQuantidadeVagas('');
      setDuracao('');
      setAtividadeTrabalho('');

      navigate('/tabelas?aba=participacao');
    } catch (error) {
      console.error('Erro completo:', error);
      alert('Erro ao cadastrar: ' + (error as Error).message);
    }
  }

  return (
    <>
      <Cabecalho />
      <section className="form-section">
        <h3>Cadastro de Participação</h3>
        <form className="form-login" onSubmit={handleSubmit}>
          <label>
            ID do Trabalho
            <input
              type="number"
              placeholder="Informe o ID do trabalho"
              value={idTrabalho}
              onChange={(e) => setIdTrabalho(e.target.value)}
              required
            />
          </label>

          <label>
            ID do Voluntário
            <input
              type="number"
              placeholder="Informe o ID do voluntário"
              value={idVoluntario}
              onChange={(e) => setIdVoluntario(e.target.value)}
              required
            />
          </label>

          <label>
            Quantidade de Vagas
            <input
              type="number"
              placeholder="Informe a quantidade de vagas"
              value={quantidadeVagas}
              onChange={(e) => setQuantidadeVagas(e.target.value)}
              required
            />
          </label>

          <label>
            Duração
            <input
              type="text"
              placeholder="Ex: 2 semanas"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              required
            />
          </label>

          <label>
            Atividade do Trabalho
            <input
              type="text"
              placeholder="Descreva a atividade"
              value={atividadeTrabalho}
              onChange={(e) => setAtividadeTrabalho(e.target.value)}
              required
            />
          </label>

          <button type="submit">CADASTRAR</button>
        </form>
      </section>
    </>
  );
}
