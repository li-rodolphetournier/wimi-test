import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { todoService } from '@/services/todo.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import type { CreateTodoInput, TodoList, Todo } from '@/types';

interface TodoFormProps {
  todoLists: TodoList[];
  onTodoCreated?: (todo: Todo) => void;
  onCancel?: () => void;
}

interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  todoListId: string;
}

export function TodoForm({ todoLists, onTodoCreated, onCancel }: TodoFormProps) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<TodoFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      todoListId: todoLists.length > 0 ? todoLists[0].id.toString() : '',
    },
  });

  const validateDueDate = (value: string) => {
    if (!value) return true;

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return 'La date d\'échéance ne peut pas être dans le passé';
    }

    return true;
  };

  const onSubmit = async (data: TodoFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const todoData: CreateTodoInput = {
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        todoListId: parseInt(data.todoListId, 10),
        priority: data.priority,
        dueDate: data.dueDate || undefined,
      };

      const newTodo = await todoService.createTodo(todoData);
      reset();
      onTodoCreated?.(newTodo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la tâche';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (todoLists.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          <p>Vous devez créer au moins une liste de tâches avant de pouvoir ajouter des tâches.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Nouvelle tâche</h3>
          <p className="text-sm text-gray-600 mt-1">
            Ajoutez une nouvelle tâche à l'une de vos listes
          </p>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Titre de la tâche *"
            placeholder="Ex: Finaliser le rapport mensuel"
            {...register('title', {
              required: 'Le titre est obligatoire',
              minLength: {
                value: 3,
                message: 'Le titre doit contenir au moins 3 caractères',
              },
              maxLength: {
                value: 100,
                message: 'Le titre ne peut pas dépasser 100 caractères',
              },
            })}
            error={errors.title?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnel)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Détails supplémentaires sur la tâche..."
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'La description ne peut pas dépasser 500 caractères',
                },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Liste de tâches *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              {...register('todoListId', {
                required: 'Veuillez sélectionner une liste',
              })}
            >
              {todoLists.map((list) => (
                <option key={list.id} value={list.id.toString()}>
                  {list.title}
                </option>
              ))}
            </select>
            {errors.todoListId && (
              <p className="mt-1 text-sm text-red-600">{errors.todoListId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'low', label: 'Basse', color: 'text-green-700 bg-green-100' },
                { value: 'medium', label: 'Moyenne', color: 'text-yellow-700 bg-yellow-100' },
                { value: 'high', label: 'Haute', color: 'text-red-700 bg-red-100' },
              ].map(({ value, label, color }) => (
                <label key={value} className="flex items-center">
                  <input
                    type="radio"
                    value={value}
                    {...register('priority')}
                    className="sr-only"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    watch('priority') === value ? color : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                  }`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Date d'échéance (optionnel)"
            type="date"
            {...register('dueDate', {
              validate: validateDueDate,
            })}
            error={errors.dueDate?.message}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Création...' : 'Créer la tâche'}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            )}
          </div>
        </form>
      </div>
    </Card>
  );
}
