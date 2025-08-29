import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import TabelaVoluntario from './TabelaVoluntario/TabelaVoluntario';
import TabelaTrabalho from './TabelaTrabalho/TabelaTrabalho';
import TabelaParticipacao from './TabelaParticipacao/TabelaParticipacao';

export default function TabelasAbas() {
  const [searchParams] = useSearchParams();
  const abaUrl = searchParams.get('aba');

  const [abaAtiva, setAbaAtiva] = useState('voluntario');

  useEffect(() => {
    if (abaUrl === 'voluntario' || abaUrl === 'trabalho' || abaUrl === 'participacao') {
      setAbaAtiva(abaUrl);
    }
  }, [abaUrl]);

  return (
    <div>
      <section>
        {abaAtiva === 'voluntario' && <TabelaVoluntario />}
        {abaAtiva === 'trabalho' && <TabelaTrabalho />}
        {abaAtiva === 'participacao' && <TabelaParticipacao />}
      </section>
    </div>
  );
}