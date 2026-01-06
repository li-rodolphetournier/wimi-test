import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { todoService } from '@/services/todo.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import type { Todo, UpdateTodoInput } from '@/types';
import { motion } from 'framer-motion';

interface TodoEditModalProps {
  isOpen: boolean;
  todo: Todo;
  onClose: () => void;
  onTodoUpdated: (updatedTodo: Todo) => void;
}

interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export function TodoEditModal({ isOpen, todo, onClose, onTodoUpdated }: TodoEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<TodoFormData>({
    mode: 'onChange',
    defaultValues: {
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      dueDate: todo.dueDate || '',
    },
  });

  useEffect(() => {
    setIsBrowser(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      reset({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        dueDate: todo.dueDate || '',
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, todo, reset]);

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
    setIsSubmitting(true);

    try {
      const updates: UpdateTodoInput = {
        title: data.title.trim(),
        description: data.description.trim() || '',
        priority: data.priority,
        dueDate: data.dueDate || '',
      };

      const updatedTodo = await todoService.updateTodo(todo.id, updates);
      
      showToast({
        message: `✏️ Tâche "${updatedTodo.title}" modifiée avec succès !`,
        type: 'success',
      });

      onTodoUpdated(updatedTodo);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification';
      showToast({
        message: `❌ ${errorMessage}`,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isBrowser || !isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Modifier la tâche</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Titre de la tâche *"
            id="edit-title"
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
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnel)
            </label>
            <textarea
              id="edit-description"
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
                    id={`edit-priority-${value}`}
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
            id="edit-dueDate"
            type="date"
            {...register('dueDate', {
              validate: validateDueDate,
            })}
            error={errors.dueDate?.message}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Modification...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

