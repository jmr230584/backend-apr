import React, { createContext, useState, ReactNode } from 'react';
import LoginPayload from '../Interfaces/LoginPayload'; // Interface que define username e senha
import AuthRequests from '../fetch/AuthRequests';
import { useContext } from 'react';

// Define os tipos de dados e funções disponíveis no contexto de autenticação
interface AuthContextType {
  // Usuário autenticado
  user: { 
    username: string | null; 
    idUsuario: string | null; 
    avatarUrl?: string | null;
  } | null; 

  login: (payload: LoginPayload) => Promise<boolean>; // Função para fazer login
  logout: () => void; // Função para fazer logout
  isAuthenticated: boolean;
}

// Cria o contexto de autenticação com valores padrão
const AuthContext = createContext<AuthContextType>({
  user: null,                     // Nenhum usuário autenticado inicialmente
  login: async () => false,      // Função de login padrão
  logout: () => {},              // Função de logout padrão
  isAuthenticated: false,        // Função que controla o estado do login
});

// Componente que fornece o contexto para toda a aplicação
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado que guarda o usuário autenticado
  const [user, setUser] = useState<{
    username: string | null;
    idUsuario: string | null;
    avatarUrl?: string | null;
    email?: string | null; 
} | null>(null);

  const login = async (payload: LoginPayload): Promise<boolean> => {
  try {
    const success = await AuthRequests.login(payload);

    if (success) {
      // Recupera os dados do usuário do localStorage
      const email = localStorage.getItem('email');
      const idUsuario = localStorage.getItem('idUsuario');
      const avatarUrl = localStorage.getItem('avatarUrl');
      
  const username = localStorage.getItem('username');
  
  if (username && idUsuario) {
    setUser({ username, email, idUsuario, avatarUrl });
}


      return true;
    }

    return false;
  } catch (err) {
    console.error('Erro ao autenticar:', err);
    return false;
  }
};

  // Função de logout: limpa o localStorage e reseta o estado
  const logout = () => {
    localStorage.clear(); // Remove todos os dados de sessão
    setUser(null);        // Reseta o usuário
    window.location.href = '/login'; // Redireciona para a página de login
  };

  // Retorna o Provider do contexto com os dados e funções disponíveis
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, }}>
      {children} 
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
