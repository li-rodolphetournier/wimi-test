import api from './api';
import type { TodoList } from '@/types';

/**
 * Constantes pour les endpoints API
 */
const API_ENDPOINTS = {
  TODO_LISTS: '/todoLists',
} as const;

/**
 * Service pour gérer les listes de tâches (TodoList)
 * Utilise l'API mock json-server sur http://localhost:3001
 */
export const todoListService = {
  /**
   * Récupère toutes les listes de tâches d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @returns Tableau des listes de tâches de l'utilisateur, triées par date décroissante
   * @throws Error si la requête échoue
   */
  async getTodoListsByUserId(userId: number): Promise<TodoList[]> {
    const response = await api.get<TodoList[]>(API_ENDPOINTS.TODO_LISTS, {
      params: {
        userId,
      },
    });

    // Tri par date de création décroissante (plus récentes en premier)
    return response.data.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },
};