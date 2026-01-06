import { useState } from 'react';
import { todoService } from '@/services/todo.service';
import { Checkbox } from '@/components/ui/Checkbox';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TodoEditModal } from './TodoEditModal';
import { useToast } from '@/components/ui/ToastContext';
import type { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onUpdate?: (updatedTodo: Todo) => void;
  onDelete?: (todoId: number) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState(todo.completed);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { showToast } = useToast();

  const handleToggleComplete = async () => {
    const newCompletedState = !optimisticCompleted;

    setOptimisticCompleted(newCompletedState);
    setIsUpdating(true);
    setError(null);

    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        completed: newCompletedState,
      });
      onUpdate?.(updatedTodo);
    } catch (err) {
      setOptimisticCompleted(!newCompletedState);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      showToast({
        message: `❌ ${errorMessage}`,
        type: 'error',
      });
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    
    try {
      await todoService.deleteTodo(todo.id);
      onDelete?.(todo.id);
      showToast({
        message: `🗑️ Tâche "${todo.title}" supprimée.`,
        type: 'info',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      showToast({
        message: `❌ ${errorMessage}`,
        type: 'error',
      });
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleTodoUpdated = (updatedTodo: Todo) => {
    onUpdate?.(updatedTodo);
  };

  const formatDueDate = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let colorClass = '';
    let text = '';

    if (diffDays < 0) {
      colorClass = 'text-red-600 font-medium';
      text = `Échu il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      colorClass = 'text-orange-600 font-medium';
      text = 'Échéance aujourd\'hui';
    } else if (diffDays === 1) {
      colorClass = 'text-yellow-600 font-medium';
      text = 'Échéance demain';
    } else if (diffDays <= 7) {
      colorClass = 'text-blue-600';
      text = `Échéance dans ${diffDays} jours`;
    } else {
      colorClass = 'text-gray-500';
      text = due.toLocaleDateString('fr-FR');
    }

    return { text, colorClass };
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Supprimer la tâche"
        message={`Êtes-vous sûr de vouloir supprimer "${todo.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <TodoEditModal
        isOpen={showEditModal}
        todo={todo}
        onClose={() => setShowEditModal(false)}
        onTodoUpdated={handleTodoUpdated}
      />

      <div className="group relative">
      {error && (
        <div className="absolute -top-2 left-0 right-0 z-10 bg-red-50 border border-red-200 rounded px-2 py-1 text-xs text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        <Checkbox
          checked={optimisticCompleted}
          isLoading={isUpdating}
          onChange={handleToggleComplete}
          className="mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium truncate ${
                optimisticCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h4>

              {todo.description && (
                <p className={`text-xs mt-1 ${
                  optimisticCompleted ? 'line-through text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}

              <div className="flex items-center space-x-3 mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                  todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {todo.priority === 'high' ? 'Haute' : todo.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>

                {todo.dueDate && (
                  <span className={`text-xs ${formatDueDate(todo.dueDate).colorClass}`}>
                    {formatDueDate(todo.dueDate).text}
                  </span>
                )}

                <span className="text-xs text-gray-400">
                  Créé le {new Date(todo.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
              <div className="flex space-x-1">
                <button
                  className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                  title="Modifier"
                  onClick={() => setShowEditModal(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                  title="Supprimer"
                  onClick={handleDeleteClick}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
