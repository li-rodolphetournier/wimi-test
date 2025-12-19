export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    todoListId: number; // Référence à la TodoList parente
    priority: 'low' | 'medium' | 'high';
    dueDate: string; // ISO date string
    createdAt: string; // ISO date string
  }
  
  // Type pour créer un nouveau todo (sans id et createdAt)
  export interface CreateTodoInput {
    title: string;
    description?: string;
    todoListId: number;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
  }
  
  // Type pour mettre à jour un todo
  export interface UpdateTodoInput {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
  }