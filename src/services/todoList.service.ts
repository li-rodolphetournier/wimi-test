import api from './api';
import type { TodoList } from '@/types';

const API_ENDPOINTS = {
  TODO_LISTS: '/todoLists',
} as const;

export const todoListService = {
  async getTodoListsByUserId(userId: number): Promise<TodoList[]> {
    const response = await api.get<TodoList[]>(API_ENDPOINTS.TODO_LISTS, {
      params: { userId },
    });

    return response.data.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};