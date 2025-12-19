import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête : ajoute le token d'authentification si disponible
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Si le backend nécessite un token, l'ajouter ici
        // config.headers.Authorization = `Bearer ${userData.token}`;
      } catch (error) {
        console.error('Erreur lors de la lecture des données utilisateur:', error);
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : gestion globale des erreurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Erreur avec réponse du serveur
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
      // Requête envoyée mais pas de réponse
      console.error('Pas de réponse du serveur. Vérifiez que le serveur mock est démarré sur http://localhost:3001');
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;