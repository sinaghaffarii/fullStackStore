export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    role: 'admin';
  };
  token?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface AuthError {
  message: string;
  field?: 'password' | 'username';
  statusCode: number;
}
