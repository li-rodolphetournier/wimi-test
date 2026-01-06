import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { todoListService } from '@/services/todoList.service';
import { todoService } from '@/services/todo.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import type { TodoList, Todo } from '@/types';

/**
 * Interface pour grouper une liste avec ses todos
 */
interface TodoListWithTodos extends TodoList {
  todos: Todo[];
}

/**
 * Composant TodoList - Affiche les listes de tâches de l'utilisateur avec leurs todos
 */
export function TodoList() {
  const { user } = useAuthStore();
  const [listsWithTodos, setListsWithTodos] = useState<TodoListWithTodos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les listes de l'utilisateur
        const lists = await todoListService.getTodoListsByUserId(user.id);

        // Pour chaque liste, récupérer ses todos
        const listsWithTodosPromises = lists.map(async (list): Promise<TodoListWithTodos> => {
          const todos = await todoService.getTodosByListId(list.id);
          return {
            ...list,
            todos,
          };
        });

        // Attendre que toutes les requêtes soient terminées
        const listsWithTodosData = await Promise.all(listsWithTodosPromises);
        setListsWithTodos(listsWithTodosData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  /**
   * Gère la mise à jour d'un todo dans une liste
   */
  const handleTodoUpdate = (listId: number, updatedTodo: Todo) => {
    setListsWithTodos(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              todos: list.todos.map(todo =>
                todo.id === updatedTodo.id ? updatedTodo : todo
              )
            }
          : list
      )
    );
  };

  /**
   * Gère la suppression d'un todo d'une liste
   */
  const handleTodoDelete = (listId: number, todoId: number) => {
    setListsWithTodos(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              todos: list.todos.filter(todo => todo.id !== todoId)
            }
          : list
      )
    );
  };

  /**
   * Gère la création d'une nouvelle tâche
   */
  const handleTodoCreated = (newTodo: Todo) => {
    setListsWithTodos(prevLists =>
      prevLists.map(list =>
        list.id === newTodo.todoListId
          ? {
              ...list,
              todos: [newTodo, ...list.todos] // Ajouter au début de la liste
            }
          : list
      )
    );
    setShowCreateForm(false); // Masquer le formulaire après création
  };

  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erreur de chargement
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Aucun utilisateur connecté
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Veuillez vous connecter pour voir vos tâches.</p>
      </div>
    );
  }

  // Aucune liste
  if (listsWithTodos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune liste de tâches
        </h3>
        <p className="text-gray-500">
          Vous n'avez pas encore de listes de tâches. Créez-en une pour commencer !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mes Listes de Tâches
          </h1>
          <p className="text-gray-600">
            {listsWithTodos.length} liste{listsWithTodos.length > 1 ? 's' : ''} • {listsWithTodos.reduce((total, list) => total + list.todos.length, 0)} tâche{listsWithTodos.reduce((total, list) => total + list.todos.length, 0) > 1 ? 's' : ''}
          </p>
        </div>

        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="shrink-0"
        >
          {showCreateForm ? 'Annuler' : '+ Nouvelle tâche'}
        </Button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <TodoForm
          todoLists={listsWithTodos}
          onTodoCreated={handleTodoCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listsWithTodos.map((list) => (
          <Card key={list.id} className="h-fit">
            {/* En-tête de la liste */}
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: list.color }}
              />
              <h3 className="font-semibold text-gray-900 truncate">
                {list.title}
              </h3>
            </div>

            {/* Statistiques de la liste */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>
                {list.todos.filter(todo => todo.completed).length}/{list.todos.length} terminées
              </span>
              <span>
                {new Date(list.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>

            {/* Liste des todos */}
            <div className="space-y-1">
              {list.todos.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4">
                  Aucune tâche dans cette liste
                </p>
              ) : (
                list.todos.slice(0, 5).map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={(updatedTodo) => handleTodoUpdate(list.id, updatedTodo)}
                    onDelete={(todoId) => handleTodoDelete(list.id, todoId)}
                  />
                ))
              )}

              {/* Indicateur si plus de 5 todos */}
              {list.todos.length > 5 && (
                <p className="text-xs text-gray-400 text-center py-2 border-t border-gray-100 pt-2 mt-2">
                  +{list.todos.length - 5} autres tâches...
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
