import { useSearchParams } from 'react-router-dom';
import CadastroVoluntario from '../Cadastro/Voluntario/CadastroVoluntario';
import CadastroTrabalho from '../Cadastro/Trabalho/CadastroTrabalho';
import CadastroParticipacao from '../Cadastro/Participacao/CadastroParticipacao';

/**
 * Componente de cadastro unificado
 * Escolhe qual formulário de cadastro renderizar com base no parâmetro 'redirect' da URL
 */
export default function Cadastro() {
  const [searchParams] = useSearchParams();
  const tipoCadastro = searchParams.get('redirect');

  if (tipoCadastro === 'voluntario') {
    return <CadastroVoluntario />;
  }

  if (tipoCadastro === 'trabalho') {
    return <CadastroTrabalho />;
  }

  if (tipoCadastro === 'participacao') {
    return <CadastroParticipacao />;
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Tipo de cadastro inválido</h2>
      <p>Certifique-se de acessar a URL corretamente com o parâmetro <code>?redirect=voluntario</code>, <code>trabalho</code> ou <code>participacao</code>.</p>
    </div>
  );
}