import type { UserWithoutPassword } from '@/types';

const STORAGE_KEYS = {
    USER: 'user',
} as const;

/* sauvegarde l'utilisateur dans le localStorage */

export function saveUser(user: UserWithoutPassword): void {
    try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
        console.error('Error lors de la sauvegarde de l\'utilisateur:', error);
    }
}

/* Récupère l'utilisateur dans le localStorage */

export function getUser(): UserWithoutPassword | null {
    try {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if(!userStr) return null;
        return JSON.parse(userStr) as UserWithoutPassword;
    } catch (error) {
        console.error('Error lors de la récupération de l\'utilisateur:', error);
        return null;
    }
}

/* supprime l'utilisateur du localStorage */

export function removeUser(): void {
    try {
        localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
        console.error('Error lors de la suppression de l\'utilisateur:', error);
    }
}