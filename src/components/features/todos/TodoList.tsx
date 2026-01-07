import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { todoListService } from '@/services/todoList.service';
import { todoService } from '@/services/todo.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { StaggerChildren, StaggerItem } from '@/components/ui/animations/StaggerChildren';
import { ScaleIn } from '@/components/ui/animations/ScaleIn';
import type { TodoList, Todo } from '@/types';

interface TodoListWithTodos extends TodoList {
  todos: Todo[];
}

export function TodoList() {
  const { user } = useAuthStore();
  const [listsWithTodos, setListsWithTodos] = useState<TodoListWithTodos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedLists, setExpandedLists] = useState<Record<number, boolean>>({});
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const lists = await todoListService.getTodoListsByUserId(user.id);

        const listsWithTodosPromises = lists.map(async (list): Promise<TodoListWithTodos> => {
          const todos = await todoService.getTodosByListId(list.id);
          return { ...list, todos };
        });

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

  const toggleExpandList = (listId: number) => {
    setExpandedLists(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
  };

  const handleTodoCreated = (newTodo: Todo) => {
    setListsWithTodos(prevLists => {
      const updatedLists = prevLists.map(list => {
        // Convertir les deux IDs en number pour la comparaison (list.id peut être string)
        if (Number(list.id) === Number(newTodo.todoListId)) {
          const updatedTodos = [newTodo, ...list.todos];
          
          // Trier les todos (priorité puis date)
          const sortedTodos = updatedTodos.sort((a, b) => {
            const priorityOrder: Record<'low' | 'medium' | 'high', number> = {
              high: 3,
              medium: 2,
              low: 1,
            };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            
            if (priorityDiff !== 0) return priorityDiff;
            
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          return { ...list, todos: sortedTodos };
        }
        return list;
      });
      
      // Remonter la liste qui vient de recevoir la nouvelle tâche en premier
      const sortedLists = [...updatedLists].sort((a, b) => {
        // La liste qui contient la nouvelle tâche passe en premier
        if (Number(a.id) === Number(newTodo.todoListId)) return -1;
        if (Number(b.id) === Number(newTodo.todoListId)) return 1;
        // Sinon garder l'ordre par date de création décroissante
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      return sortedLists;
    });
    
    setShowCreateForm(false);
    
    // Afficher un toast de succès
    showToast({
      message: `✅ Tâche "${newTodo.title}" créée avec succès !`,
      type: 'success',
    });
    
    // Scroller vers la liste concernée
    setTimeout(() => {
      const listElement = document.getElementById(`list-${newTodo.todoListId}`);
      if (listElement) {
        listElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Ajouter un effet visuel temporaire
        listElement.classList.add('ring-2', 'ring-green-400', 'ring-offset-2');
        setTimeout(() => {
          listElement.classList.remove('ring-2', 'ring-green-400', 'ring-offset-2');
        }, 2000);
      }
    }, 100);
  };

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
            <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Veuillez vous connecter pour voir vos tâches.</p>
      </div>
    );
  }

  if (listsWithTodos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune liste de tâches</h3>
        <p className="text-gray-500">Vous n'avez pas encore de listes de tâches. Créez-en une pour commencer !</p>
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

        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="shrink-0">
          {showCreateForm ? 'Annuler' : '+ Nouvelle tâche'}
        </Button>
      </div>

      {showCreateForm && (
        <ScaleIn>
          <TodoForm
            todoLists={listsWithTodos}
            onTodoCreated={handleTodoCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </ScaleIn>
      )}

      <StaggerChildren staggerDelay={0.1}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {listsWithTodos.map((list) => (
            <StaggerItem key={list.id}>
              <Card 
                className="h-full flex flex-col transition-all duration-300"
                id={`list-${list.id}`}
              >
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: list.color }}
              />
              <h3 className="font-semibold text-gray-900 truncate">{list.title}</h3>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>
                {list.todos.filter(todo => todo.completed).length}/{list.todos.length} terminées
              </span>
              <span>{new Date(list.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>

            <div className="space-y-1">
              {list.todos.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4">
                  Aucune tâche dans cette liste
                </p>
              ) : (
                <>
                  {(expandedLists[list.id] ? list.todos : list.todos.slice(0, 5)).map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={(updatedTodo) => handleTodoUpdate(list.id, updatedTodo)}
                      onDelete={(todoId) => handleTodoDelete(list.id, todoId)}
                    />
                  ))}

                  {list.todos.length > 5 && (
                    <button
                      onClick={() => toggleExpandList(list.id)}
                      className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium text-center py-2 border-t border-gray-100 pt-2 mt-2 transition-colors hover:bg-blue-50 rounded"
                    >
                      {expandedLists[list.id] 
                        ? '▲ Masquer les tâches' 
                        : `▼ Voir ${list.todos.length - 5} autres tâches`
                      }
                    </button>
                  )}
                </>
              )}
            </div>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </StaggerChildren>
    </div>
  );
}
