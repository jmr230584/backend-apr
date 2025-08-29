// Importa o tipo JSX do React para definir o tipo de retorno do componente
import { JSX } from 'react';

// Importa os estilos CSS específicos para o formulário de login
import '../LoginForm/LoginForm.css';



// Importe dos formulários dos botões
import Login from './Login/Login';

function LoginForm(): JSX.Element {
    return (
      <div className="LF-button">
        <Login />
      </div>
    );
  }
  
  export default LoginForm;