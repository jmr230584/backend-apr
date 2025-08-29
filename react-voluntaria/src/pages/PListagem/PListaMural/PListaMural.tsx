import { useEffect, useState } from 'react';

// Componentes reutilizáveis
import Cabecalho from "../../../components/Cabecalho/Cabecalho";
import CardMural from '../../../components/Card/CardMural';

// Requisições
import MuralRequests from '../../../fetch/MuralRequests';

// Tipagem da interface
import MuralTrabalhosDTO from '../../../Interfaces/MuralInterface';

// Estilos
import styles from './ListagemMural.module.css';

// Ícones e botão
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Button } from 'react-bootstrap';

function PListagemMural() {
    const [trabalhos, setTrabalhos] = useState<MuralTrabalhosDTO[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 4;

    useEffect(() => {
        const fetchTrabalhos = async () => {
            const lista = await MuralRequests.listarMuralTrabalhos();
            setTrabalhos(Array.isArray(lista) ? lista : []);
        };
        fetchTrabalhos();
    }, []);

    const indiceInicial = (paginaAtual - 1) * itensPorPagina;
    const indiceFinal = indiceInicial + itensPorPagina;
    const trabalhosExibidos = trabalhos.slice(indiceInicial, indiceFinal);
    const totalPaginas = Math.ceil(trabalhos.length / itensPorPagina);

    const proximaPagina = () => {
        if (indiceFinal < trabalhos.length) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    return (
        <>
            <Cabecalho />
            <h1 className={styles.h1}> Trabalhos Concluídos: </h1>
            <div className={styles.cardsContainer}>
                {trabalhosExibidos.map(trabalho => (
                    <CardMural key={trabalho.idMuralTrabalhos} mural={trabalho} className={styles.cards} />
                ))}
            </div>
            <div className={styles.paginacao}>
                <Button onClick={paginaAnterior} disabled={paginaAtual === 1} className={styles.botao}>
                    <GrFormPrevious className={styles.iconBotao} />
                </Button>
                <Button onClick={proximaPagina} disabled={indiceFinal >= trabalhos.length} className={styles.botao}>
                    <GrFormNext className={styles.iconBotao} />
                </Button>
            </div>
            <p className={styles['pagina-indicador']}>
                Página {paginaAtual} de {totalPaginas}
            </p>
        </>
    );
}

export default PListagemMural;
