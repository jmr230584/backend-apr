interface LoginResponse {
    auth: boolean;
    token: string;
    usuario: {
        nome: string;
        id_usuario: number;
        avatarUrl?: string;
    };
}

export default LoginResponse;