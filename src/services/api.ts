import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as { message?: string })?.message || error.message;

      switch (status) {
        case 401:
          console.error('Non autorisé:', message);
          break;
        case 403:
          console.error('Accès interdit:', message);
          break;
        case 404:
          console.error('Ressource non trouvée:', message);
          break;
        case 500:
          console.error('Erreur serveur:', message);
          break;
        default:
          console.error(`Erreur ${status}:`, message);
      }
    } else if (error.request) {
      console.error('Pas de réponse du serveur. Vérifiez que le serveur mock est démarré sur http://localhost:3001');
    } else {
      console.error('Erreur de configuration:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;