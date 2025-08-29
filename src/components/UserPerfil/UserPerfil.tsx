import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './UserPerfil.css';

const UserPerfil = () => {
  // Obtém os dados e funções do contexto de autenticação
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados para os campos editáveis
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Efeito para verificar se a página foi acessada no modo edição
  useEffect(() => {
    // Verifica se há um parâmetro 'edit' na URL
    const searchParams = new URLSearchParams(location.search);
    const editMode = searchParams.get('edit') === 'true';
    
    if (editMode) {
      setIsEditing(true);
    }
  }, [location.search]);

  // Efeito para atualizar os estados quando o usuário muda
  useEffect(() => {
    setNome(user?.nome || '');
    setEmail(user?.email || '');
    setTelefone(user?.telefone || '');
  }, [user]);

  // Função para salvar as alterações do perfil
  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await updateUser({
        nome,
        telefone
        // Note que não incluímos email aqui pois geralmente não se muda email
      });
      
      setIsEditing(false);
      // Remove o parâmetro de edição da URL após salvar
      navigate('/perfil', { replace: true });
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Função para entrar no modo de edição
  const enterEditMode = () => {
    setIsEditing(true);
    // Adiciona parâmetro à URL para indicar modo edição
    navigate('/perfil?edit=true', { replace: true });
  };

  // Função para cancelar edição
  const cancelEdit = () => {
    setIsEditing(false);
    // Remove parâmetro da URL ao cancelar
    navigate('/perfil', { replace: true });
    // Reseta os valores para os originais
    setNome(user?.nome || '');
    setTelefone(user?.telefone || '');
  };

  return (
    <div className="perfil-container">
      <h2>{isEditing ? 'Editar Perfil' : 'Meu Perfil'}</h2>
      
      {/* Seção do avatar */}
      <div className="avatar-section">
        <img 
          src={user?.avatarUrl || '/default-avatar.png'} 
          alt="Avatar" 
          className="avatar"
        />
        {isEditing && (
          <button className="change-avatar-btn">Alterar Foto</button>
        )}
      </div>

      {/* Modo edição ou visualização */}
      {isEditing ? (
        <div className="edit-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled // Email geralmente não pode ser editado
            />
          </div>

          <div className="form-group">
            <label>Telefone:</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="button-group">
            <button 
              onClick={handleSave} 
              className="save-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              onClick={cancelEdit} 
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="info-section">
          <p><strong>Nome:</strong> {user?.nome || 'Não informado'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Telefone:</strong> {user?.telefone || 'Não informado'}</p>

          <div className="button-group">
            <button onClick={enterEditMode} className="edit-btn">
              Editar Perfil
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPerfil;