import { JSX } from 'react';
import estilo from './Welcome.module.css';

import imagem1 from '../../assets/imagem1.png';
import imagem2 from '../../assets/imagem2.png';
import imagem33 from '../../assets/imagem3.gif'
import logotipo from '../../assets/logotipo.png';





function Welcome(): JSX.Element {
    return (
        <main className={estilo.principal}>
            <div className={estilo.esquerda}>
                <div className={estilo.esquerda1}>
                    <img src={logotipo} alt="Logotipo" />
                </div>

                <div className={estilo.esquerda2}>
                    <p className={estilo.bemVindo}>Seja bem-vindo(a) ao Voluntaria Brasil.</p>
                    <p className={estilo.msgInicial}>
                        Você já pensou em doar um pouco do seu tempo para fazer a diferença na vida de alguém?
                        No Voluntaria Brasil, você encontra oportunidades de voluntariado em diversas áreas,
                        em todo o país, para todos os perfis e habilidades.
                    </p>
                </div>

                <div className={estilo.esquerda3}>
                    <h3>CONTATO:</h3>
                    <p>Telefone/WhatsApp: (+55) 12 98937-3462</p>
                    <p>E-mail: voluntariaBR@hotmail.com.br</p>
                    <p>Site: www.voluntariabrasil.org</p>
                    <p>Redes Sociais:</p>
                    <p>Instagram: @voluntaria_brasil</p>
                    <p>Facebook: fb.com/voluntariaBr</p>
                </div>
            </div>

            <div className={estilo.direita}>
                <img src={imagem1} alt="imagem1" />
                <img src={imagem2} alt="imagem2" />
            
            </div>

            <img src={imagem33} alt="imagem3"  className={estilo.imagem33}/>
        

           

        </main>
    );

    

    
}



export default Welcome;
