import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AuthError,
  LogoutResponse,
} from '@/types/auth';
import type { User } from '@/types/public';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/auth`;
  }

  async adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await fetch(`${this.baseUrl}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw error;
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch {
      return null;
    }
  }

  async logout(): Promise<LogoutResponse> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw error;
    }

    return response.json();
  }

  async verifyCaptcha(token: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/verify-captcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success;
  }
}

export const authService = new AuthService();
