import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserWithoutPassword } from '@/types';
import { authService } from '@/services/auth.service';
import { saveUser, getUser, removeUser } from '@/utils/storage';

interface AuthState {
  user: UserWithoutPassword | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initialize: () => void; // Pour restaurer la session au démarrage
}

type AuthStore = AuthState & AuthActions;

/**
 * Store Zustand pour la gestion de l'authentification
 * Utilise le middleware persist pour sauvegarder dans localStorage
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({

      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.login({ email, password });
          saveUser(user); // Sauvegarde dans localStorage
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
        }
      },


      logout: () => {
        removeUser();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialisation de la session depuis le localStorage au démarrage
      initialize: () => {
        const user = getUser();
        if (user) {
          set({
            user,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage', // Clé dans localStorage
      partialize: (state) => ({ user: state.user }), // Ne persiste que l'utilisateur
    }
  )
);