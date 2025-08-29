// CardMural.tsx
import Card from 'react-bootstrap/Card';
import MuralTrabalhosDTO from '../../Interfaces/MuralInterface';
import { JSX } from 'react';

interface MuralProps {
    mural: MuralTrabalhosDTO;
    className?: string;
}

function CardMural({ mural, className }: MuralProps): JSX.Element {
    const estiloParagrafo: React.CSSProperties = {
        fontSize: '1rem',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        margin: 0,
    };

    const estiloAlinhamento: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    };

    const estiloTextoOverflow: React.CSSProperties = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        marginLeft: '8px',
    };

    const estiloCard: React.CSSProperties = {
        width: '18rem',
        height: '45vh',
        margin: '1%',
        backgroundColor: 'var(--cardBg)',
    };

    return (
        <Card style={estiloCard} className={className}>
            <Card.Body key={mural.idMuralTrabalhos}>
                <Card.Title>
                    <h2>Voluntaria Brasil</h2>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{mural.nomeTrabalho}</Card.Subtitle>
                <hr />
                <Card.Text style={estiloAlinhamento}>
                    <p style={estiloParagrafo}>Ong Responsável:</p>
                    <span style={estiloTextoOverflow}>{mural.ongResponsavel}</span>
                </Card.Text>
                <Card.Text style={estiloAlinhamento}>
                    <p style={estiloParagrafo}>Voluntários:</p>
                    <span style={estiloTextoOverflow}>{mural.totalVoluntarios}</span>
                </Card.Text>
                <Card.Text style={estiloAlinhamento}>
                    <p style={estiloParagrafo}>Encerramento:</p>
                    <span style={estiloTextoOverflow}>
                        {new Date(mural.dataEncerramento).toLocaleDateString('pt-BR')}
                    </span>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default CardMural;
