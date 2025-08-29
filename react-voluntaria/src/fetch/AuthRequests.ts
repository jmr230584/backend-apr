import LoginPayload from "../Interfaces/LoginPayload";
import LoginResponse from "../Interfaces/LoginResponse";

class AuthRequests {
  private serverUrl = 'http://localhost:3332';
  private routeLogin = '/login';

  /**
   * Envia os dados de login para o backend e retorna true se autenticação for bem-sucedida
   */
  async login(payload: LoginPayload): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}${this.routeLogin}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const data: LoginResponse = await response.json();

      if (data.auth) {
        this.persistToken(data.token, data.usuario.nome, data.usuario.id_usuario, data.auth, data.usuario.avatarUrl || '' );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Persiste token e dados do usuário no localStorage
   */
  persistToken(token: string, username: string, idUsuario: number, isAuth: boolean, avatarUrl: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('idUsuario', idUsuario.toString());
    localStorage.setItem('isAuth', isAuth.toString());
    localStorage.setItem('avatarUrl', avatarUrl);
  }

  /**
   * Remove token e dados do usuário do localStorage e redireciona para login
   */
  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('avatarUrl');
    window.location.href = '/login';
  }

  /**
   * Verifica se o token JWT armazenado está válido
   */
  checkTokenExpiry(): boolean {
    const token = localStorage.getItem('token');

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        this.removeToken();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }
}

export default new AuthRequests();
