export interface User {
    id: number;
    email: string;
    password: string; // Utilisé uniquement pour l'API, ne pas stocker côté client
    firstName: string;
    lastName: string;
    avatar: string;
    role: string;
  }
  
  // Type pour l'utilisateur sans le mot de passe (sécurité)
  export type UserWithoutPassword = Omit<User, 'password'>;