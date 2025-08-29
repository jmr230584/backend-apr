import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
      {isAuthenticated && user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={user?.avatarUrl || '/default-avatar.png'} alt="Avatar" width={40} height={40} />
          <span>{user.email}</span>
          <button onClick={logout}>Sair</button>
        </div>
      ) : (
        <span>Seja Bem-vindo ao Voluntaria Brasil!</span>
      )}
    </header>
  );
};

export default Header;