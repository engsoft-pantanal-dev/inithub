import api from './api';
import type { User } from '../types/user';

export type CreateUserDto = Omit<User, 'id'> & {
  password: string;
};

interface BackendLoginResponse {
  access_token: string;
}

class AuthService {
  /**
   * @returns
   */
  async login(email: string, password: string): Promise<BackendLoginResponse> {
    const response = await api.post<BackendLoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  /**
   * @returns 
   */
  async register(userData: CreateUserDto): Promise<User> {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  }
}

export const authService = new AuthService();