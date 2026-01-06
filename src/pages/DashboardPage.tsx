import { useAuthStore } from '@/store/authStore';
import { TodoList } from '@/components/features/todos/TodoList';

/**
 * Page Dashboard - Page principale de l'application
 * Affiche la liste des tâches avec une sidebar
 */
export function DashboardPage() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return null; // La protection de route devrait empêcher cela
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Layout principal avec sidebar et contenu */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* En-tête de la sidebar */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Wimi Tasks</h2>
            </div>

            {/* Informations utilisateur */}
            <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Navigation (placeholder pour plus tard) */}
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Mes tâches</span>
              </a>
            </nav>

            {/* Séparateur */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Actions utilisateur */}
            <div className="space-y-2">
              <button
                onClick={logout}
                className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <TodoList />
          </div>
        </main>
      </div>
    </div>
  );
}
