import api from "@/services/api";
import type { User } from "@/types/user";

class UsersService {
  // Listar todos os usuários
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users");
    return response.data;
  }

  // Buscar usuário por ID
  async getUserById(userId: string): Promise<User> {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  }

  // Criar usuário
  async createUser(data: { name: string; email: string; password: string; isAdmin?: boolean; emojiAvatar?: string; department?: string }): Promise<User> {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  }

  // Atualizar usuário
  async updateUser(userId: string, data: Partial<{ name: string; email: string; password?: string; isAdmin?: boolean; emojiAvatar?: string; department?: string }>): Promise<User> {
    const response = await api.patch<User>(`/users/${userId}`, data);
    return response.data;
  }

  // Deletar usuário
  async deleteUser(userId: string): Promise<User> {
    const response = await api.delete<User>(`/users/${userId}`);
    return response.data;
  }
}

export const usersService = new UsersService();
