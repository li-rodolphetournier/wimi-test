import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../TodoForm';
import type { TodoList } from '../../../../types';

// Mock du service todo
vi.mock('@/services/todo.service', () => ({
  todoService: {
    createTodo: vi.fn(),
  },
}));

// Mock du store auth
vi.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 1, email: 'test@test.com', firstName: 'Test', lastName: 'User' },
  }),
}));

const mockTodoLists: TodoList[] = [
  {
    id: 1,
    title: 'Ma Liste de Test',
    userId: 1,
    color: '#3b82f6',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Liste Travail',
    userId: 1,
    color: '#ef4444',
    createdAt: new Date().toISOString(),
  },
];

describe('TodoForm - Feature Principale: Création de Tâche', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Validation du formulaire
   * Vérifie que les champs obligatoires sont validés correctement
   */
  it('devrait valider les champs requis avant la soumission', async () => {
    const user = userEvent.setup();
    const onTodoCreated = vi.fn();

    render(
      <TodoForm 
        todoLists={mockTodoLists} 
        onTodoCreated={onTodoCreated} 
      />
    );

    // Vérifier que le formulaire est affiché
    expect(screen.getByText('Nouvelle tâche')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Finaliser le rapport/i)).toBeInTheDocument();

    // Le bouton devrait être désactivé car le formulaire est vide
    const submitButton = screen.getByRole('button', { name: /Créer la tâche/i });
    expect(submitButton).toBeDisabled();

    // Remplir un titre trop court (< 3 caractères)
    const titleInput = screen.getByPlaceholderText(/Finaliser le rapport/i);
    await user.type(titleInput, 'AB');

    // Attendre que la validation se déclenche
    await waitFor(() => {
      expect(screen.getByText(/au moins 3 caractères/i)).toBeInTheDocument();
    });

    // Remplir un titre valide
    await user.clear(titleInput);
    await user.type(titleInput, 'Tâche de test valide');

    // Le bouton devrait maintenant être activé
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  /**
   * TEST 2: Création réussie d'une tâche
   * Vérifie le flow complet de création avec tous les champs
   */
  it('devrait créer une nouvelle tâche avec succès', async () => {
    const user = userEvent.setup();
    const onTodoCreated = vi.fn();

    // Mock de la réponse API
    const mockCreatedTodo = {
      id: 123,
      title: 'Implémenter les tests',
      description: 'Ajouter des tests unitaires et e2e',
      completed: false,
      todoListId: 1,
      priority: 'high' as const,
      dueDate: '2025-01-15',
      createdAt: new Date().toISOString(),
    };

    const { todoService } = await import('@/services/todo.service');
    vi.mocked(todoService.createTodo).mockResolvedValue(mockCreatedTodo);

    render(
      <TodoForm 
        todoLists={mockTodoLists} 
        onTodoCreated={onTodoCreated}
      />
    );

    // Remplir le titre
    const titleInput = screen.getByPlaceholderText(/Finaliser le rapport/i);
    await user.type(titleInput, 'Implémenter les tests');

    // Remplir la description
    const descriptionTextarea = screen.getByPlaceholderText(/Détails supplémentaires/i);
    await user.type(descriptionTextarea, 'Ajouter des tests unitaires et e2e');

    // Sélectionner la priorité haute
    const highPriorityButton = screen.getByText('Haute');
    await user.click(highPriorityButton);

    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /Créer la tâche/i });
    await user.click(submitButton);

    // Attendre que la création soit terminée
    await waitFor(() => {
      // Vérifier que le service a été appelé avec les bonnes données
      expect(todoService.createTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Implémenter les tests',
          description: 'Ajouter des tests unitaires et e2e',
          todoListId: 1,
          priority: 'high',
        })
      );

      // Vérifier que le callback onTodoCreated a été appelé avec la tâche créée
      expect(onTodoCreated).toHaveBeenCalledWith(mockCreatedTodo);
    }, { timeout: 3000 });
  });
});
