import api from './api';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types';

const API_ENDPOINTS = {
  TODOS: '/todos',
} as const;

export const todoService = {
  async getTodosByListId(listId: number): Promise<Todo[]> {
    const response = await api.get<Todo[]>(API_ENDPOINTS.TODOS, {
      params: { todoListId: listId },
    });

    return response.data.sort((a, b) => {
      const priorityOrder: Record<'low' | 'medium' | 'high', number> = { 
        high: 3, 
        medium: 2, 
        low: 1 
      };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  async createTodo(todoData: CreateTodoInput): Promise<Todo> {
    const payload = {
      title: todoData.title,
      description: todoData.description || '',
      completed: false,
      todoListId: todoData.todoListId,
      priority: todoData.priority || 'medium',
      dueDate: todoData.dueDate || '',
    };

    const response = await api.post<Todo>(API_ENDPOINTS.TODOS, payload);
    return response.data;
  },

  async updateTodo(id: number, updates: UpdateTodoInput): Promise<Todo> {
    const response = await api.patch<Todo>(`${API_ENDPOINTS.TODOS}/${id}`, updates);
    return response.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.TODOS}/${id}`);
  },
};