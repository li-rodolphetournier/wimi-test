import api from './api';
import type { User, UserWithoutPassword } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {

  async login(credentials: LoginCredentials): Promise<UserWithoutPassword> {
    const { email, password } = credentials;

    const response = await api.get<User[]>('/users', {
      params: {
        email,
        password,
      },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const user = response.data[0];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};