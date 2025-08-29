import { ReactNode } from 'react';
import Cabecalho from '../Cabecalho/Cabecalho';
import styles from './LayoutPadrao.module.css';

interface LayoutPadraoProps {
  children: ReactNode;
}

export default function LayoutPadrao({ children }: LayoutPadraoProps) {
  return (
    <>
      <Cabecalho />
      <main className={styles.main}>
        {children}
      </main>
    </>
  );
}
