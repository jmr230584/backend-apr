import React, { createContext, useState, ReactNode, useEffect } from 'react';
import LoginPayload from '../Interfaces/LoginPayload'; // Interface que define username e senha
import AuthRequests from '../fetch/AuthRequests';
import { useContext } from 'react';

// Define os tipos de dados e funções disponíveis no contexto de autenticação
interface User {
  email: string | null;
  idUsuario: string | null;
  avatarUrl?: string | null;
  nome?: string | null;
  telefone?: string | null;
}

interface AuthContextType {
  isAuth: boolean;                   // Estado de autenticação (true/false)
  avatarUrl: string;                 // URL do avatar do usuário
  email: string;                     // Email do usuário
  user: User | null;                 // Objeto com dados do usuário
  login: (payload: LoginPayload) => Promise<boolean>; // Função para fazer login
  logout: () => void;                // Função para fazer logout
  isAuthenticated: boolean;          // Função que controla o estado do login
  updateUser: (userData: Partial<User>) => Promise<void>; // Nova função para atualizar perfil
}

// Cria o contexto de autenticação com valores padrão
const AuthContext = createContext<AuthContextType>({
  user: null,                     // Nenhum usuário autenticado inicialmente
  login: async () => false,       // Função de login padrão
  logout: () => {},               // Função de logout padrão
  isAuthenticated: false,         // Estado de autenticação padrão
  isAuth: false,                  // Estado padrão de autenticação
  avatarUrl: '',                  // Avatar padrão vazio
  email: '',                      // Email padrão vazio
  updateUser: async () => {},     // Função padrão para atualizar usuário
});

// Componente que fornece o contexto para toda a aplicação
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado que guarda o usuário autenticado
  const [user, setUser] = useState<AuthContextType['user']>(null);

  // Recupera os dados do usuário do localStorage ao iniciar a aplicação
  useEffect(() => {
    const email = localStorage.getItem('email');
    const idUsuario = localStorage.getItem('idUsuario');
    const avatarUrl = localStorage.getItem('avatarUrl');
    const nome = localStorage.getItem('nome');
    const telefone = localStorage.getItem('telefone');

    if (email && idUsuario) {
      setUser({ email, idUsuario, avatarUrl, nome, telefone });
    }
  }, []);

  // Função de login: autentica o usuário e armazena os dados
  const login = async (payload: LoginPayload): Promise<boolean> => {
    try {
      const success = await AuthRequests.login(payload);

      if (success) {
        // Recupera os dados do usuário do localStorage
        const email = localStorage.getItem('email');
        const idUsuario = localStorage.getItem('idUsuario');
        const avatarUrl = localStorage.getItem('avatarUrl');
        const nome = localStorage.getItem('nome');
        const telefone = localStorage.getItem('telefone');

        if (email && idUsuario) {
          setUser({ email, idUsuario, avatarUrl, nome, telefone });
        }

        return true;
      }

      return false;
    } catch (err) {
      console.error('Erro ao autenticar:', err);
      return false;
    }
  };

  // Função para atualizar os dados do usuário
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      // Aqui você deve implementar a chamada à API para atualizar o usuário
      // Exemplo: await AuthRequests.updateUser(userData);
      
      // Atualiza os dados no localStorage
      if (userData.nome) localStorage.setItem('nome', userData.nome);
      if (userData.telefone) localStorage.setItem('telefone', userData.telefone);
      
      // Atualiza o estado do usuário
      setUser(prev => ({
        ...prev!,
        ...userData
      }));
      
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      throw err;
    }
  };

  // Função de logout: limpa o localStorage e reseta o estado
  const logout = () => {
    localStorage.clear(); // Remove todos os dados de sessão
    setUser(null);        // Reseta o usuário
    window.location.href = '/login'; // Redireciona para a página de login
  };

  // Derivando propriedades para o contexto
  const isAuthenticated = !!user;
  const isAuth = isAuthenticated;                  // Mantém isAuth (mesmo valor de isAuthenticated)
  const avatarUrl = user?.avatarUrl ?? '';         // Se avatarUrl estiver indefinido, usa string vazia
  const email = user?.email ?? '';                 // Se email estiver indefinido, usa string vazia

  // Retorna o Provider do contexto com os dados e funções disponíveis
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser, // Adiciona a nova função ao contexto
        isAuthenticated,
        isAuth,
        avatarUrl,
        email,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };