import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { useAuthStore } from './store/authStore';

/**
 * Composant de protection de route
 * Redirige vers /login si non authentifié
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, initialize } = useAuthStore();

  // Initialise la session au démarrage
  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard (à implémenter)</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

