export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  status: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    role: 'admin';
  };
  token?: string;
}

export interface LogoutResponse {
  status: boolean;
  message: string;
}

export interface AuthError {
  message: string;
  field?: 'password' | 'username';
  statusCode: number;
}
