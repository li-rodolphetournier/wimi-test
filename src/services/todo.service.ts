import api from './api';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types';

/**
 * Constantes pour les endpoints API
 */
const API_ENDPOINTS = {
  TODOS: '/todos',
} as const;

/**
 * Service pour gérer les tâches (Todo)
 * Utilise l'API mock json-server sur http://localhost:3001
 */
export const todoService = {
  /**
   * Récupère toutes les tâches d'une liste
   * @param listId - ID de la liste de tâches
   * @returns Tableau des tâches de la liste
   * @throws Error si la requête échoue
   */
  async getTodosByListId(listId: number): Promise<Todo[]> {
    // Appel API avec query param pour filtrer par todoListId
    const response = await api.get<Todo[]>(API_ENDPOINTS.TODOS, {
      params: {
        todoListId: listId,
      },
    });

    // Retourne les tâches triées par priorité puis par date de création
    return response.data.sort((a, b) => {
      // Ordre de priorité : high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      // Si même priorité, trier par date de création (plus récentes en premier)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  /**
   * Crée une nouvelle tâche
   * @param todoData - Données de la tâche à créer
   * @returns La tâche créée avec son ID et createdAt générés par le serveur
   * @throws Error si la requête échoue
   */
  async createTodo(todoData: CreateTodoInput): Promise<Todo> {
    // Valeurs par défaut si non fournies
    const todoPayload = {
      title: todoData.title,
      description: todoData.description || '',
      completed: false, // Nouvelle tâche = non complétée par défaut
      todoListId: todoData.todoListId,
      priority: todoData.priority || 'medium', // Priorité moyenne par défaut
      dueDate: todoData.dueDate || '',
      // createdAt sera généré par json-server automatiquement
    };

    const response = await api.post<Todo>(API_ENDPOINTS.TODOS, todoPayload);
    return response.data;
  },

  /**
   * Met à jour une tâche existante
   * @param id - ID de la tâche à mettre à jour
   * @param updates - Champs à mettre à jour (tous optionnels)
   * @returns La tâche mise à jour
   * @throws Error si la requête échoue ou si la tâche n'existe pas
   */
  async updateTodo(id: number, updates: UpdateTodoInput): Promise<Todo> {
    // PATCH pour mettre à jour partiellement (seulement les champs fournis)
    const response = await api.patch<Todo>(`${API_ENDPOINTS.TODOS}/${id}`, updates);
    return response.data;
  },

  /**
   * Supprime une tâche
   * @param id - ID de la tâche à supprimer
   * @throws Error si la requête échoue
   */
  async deleteTodo(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.TODOS}/${id}`);
  },
};