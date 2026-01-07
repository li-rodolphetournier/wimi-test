# Wimi Todo Manager

Application de gestion de tâches développée avec React, TypeScript et Vite.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation

```bash
# 1. Cloner le dépôt
git clone <repository-url>
cd wimi-frontend-test

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur API mock
npm start

# 4. Dans un nouveau terminal, démarrer l'application React
npm run dev
```

L'application sera accessible sur `http://localhost:5173`  
L'API sera accessible sur `http://localhost:3001`

### Identifiants de Test

| Email                    | Mot de passe | Nom        |
| :----------------------- | :----------- | :--------- |
| john.doe@example.com     | password123  | John Doe   |
| jane.smith@example.com   | password123  | Jane Smith |
| bob.wilson@example.com   | password123  | Bob Wilson |

---

## 📦 Stack Technique

- **React 18.3** avec **TypeScript 5.9** (strict mode)
- **Vite 4.5** comme bundler
- **TailwindCSS 3.4** pour le styling
- **Zustand 4.5** pour la gestion d'état
- **React Router 6.28** pour le routing
- **Axios 1.7** pour les appels API
- **React Hook Form 7.68** pour les formulaires
- **Framer Motion 11.3** pour les animations
- **Vitest** + **Playwright** pour les tests

---

## ✨ Fonctionnalités Implémentées

### Features Requises ✅

- ✅ **Page de connexion** : Formulaire avec validation, gestion d'erreurs, persistance de session
- ✅ **Affichage des listes et tâches** : Toutes les listes de l'utilisateur avec leurs tâches
- ✅ **Marquer une tâche comme complétée** : Avec Optimistic UI
- ✅ **Créer une nouvelle tâche** : Formulaire complet avec validation
- ✅ **Modifier une tâche** : Modal d'édition avec tous les champs
- ✅ **Supprimer une tâche** : Avec dialogue de confirmation
- ✅ **Tri automatique** : Par priorité (haute → basse) puis date
- ✅ **Sidebar utilisateur** : Avatar (initiales), nom, rôle, déconnexion

### Features Bonus ✨

- ✅ **Optimistic UI** : Mise à jour immédiate de l'interface avec rollback en cas d'erreur
- ✅ **Notifications Toast** : Messages de succès/erreur/info pour toutes les actions
- ✅ **Dialogues de confirmation** : Modal élégant avant les actions destructives
- ✅ **Animations Framer Motion** : Transitions fluides entre pages, apparitions progressives
- ✅ **Validation avancée** : Validation en temps réel avec messages d'erreur contextuels
- ✅ **Loading states** : Spinners, skeleton screens pendant les chargements
- ✅ **Bouton Afficher/Masquer** : Pour les listes avec plus de 5 tâches
- ✅ **Scroll automatique** : Vers la tâche nouvellement créée
- ✅ **Design responsive** : Adaptation mobile → desktop

---

## 📁 Structure du Projet

```
src/
├── components/
│   ├── ui/                      # Composants atomiques réutilisables
│   │   ├── animations/          # Wrappers Framer Motion
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Avatar.tsx
│   │   ├── Toast.tsx
│   │   ├── ToastContext.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── index.ts
│   └── features/                # Composants métier
│       ├── auth/
│       │   └── LoginForm.tsx
│       └── todos/
│           ├── TodoList.tsx
│           ├── TodoItem.tsx
│           ├── TodoForm.tsx
│           ├── TodoEditModal.tsx
│           └── __tests__/
├── pages/                       # Pages de l'application
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── services/                    # Appels API
│   ├── api.ts
│   ├── auth.service.ts
│   ├── todo.service.ts
│   └── todoList.service.ts
├── store/                       # State management global
│   └── authStore.ts
├── types/                       # Définitions TypeScript
│   ├── index.ts
│   ├── user.types.ts
│   ├── todo.types.ts
│   └── todoList.types.ts
├── utils/                       # Fonctions utilitaires
│   └── storage.ts
├── App.tsx                      # Configuration Router
└── main.tsx                     # Point d'entrée
```

---

## 🧪 Tests

### Lancer les Tests

```bash
# Tests unitaires
npm test                # Mode watch
npm run test:ui         # Interface graphique
npm run test:coverage   # Rapport de couverture

# Tests E2E
npm run test:e2e        # Lancer les tests
npm run test:e2e:ui     # Mode interactif
```

### Couverture

- ✅ **Tests unitaires** : TodoForm (création de tâches)
- ✅ **Tests E2E** : Flow complet de connexion et création de tâche
- ✅ **Type checking** : TypeScript strict mode (0 erreurs)
- ✅ **Linting** : ESLint (0 erreurs)

---

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm start            # Démarrer le serveur API mock
npm run build        # Build de production (pour Vercel)
npm run build:check  # Build avec vérification TypeScript
npm run type-check   # Vérifier les types TypeScript
npm run lint         # Linter le code
npm run preview      # Prévisualiser le build
npm test             # Lancer les tests unitaires
npm run test:e2e     # Lancer les tests E2E
```

---

## 📡 API Endpoints

### Authentication

- `GET /users?email={email}&password={password}` - Login

### Todo Lists

- `GET /todoLists` - Liste des listes de tâches
- `GET /todoLists?userId={userId}` - Listes par utilisateur

### Todos

- `GET /todos` - Liste des tâches
- `GET /todos?todoListId={listId}` - Tâches par liste
- `POST /todos` - Créer une tâche
- `PATCH /todos/:id` - Modifier une tâche
- `DELETE /todos/:id` - Supprimer une tâche

---

## 🎨 Choix Techniques

### Architecture

- **Séparation des préoccupations** : UI atomiques vs composants métier
- **Services isolés** : Toute la logique API dans `services/`
- **Type safety** : Interfaces TypeScript strictes, pas d'usage de `any`

### Performance

- **Optimistic UI** : Mise à jour immédiate sans attendre le serveur
- **Animations GPU-accelerated** : Framer Motion pour des performances optimales
- **Code splitting** : Vite gère automatiquement le découpage du code

### UX/UI

- **Toast notifications** : Feedback visuel pour toutes les actions
- **Dialogues de confirmation** : Protection contre les erreurs
- **Animations fluides** : Transitions de page, apparitions progressives
- **Loading states** : Spinners et skeleton screens

---

## 📄 Documentation

- **`IMPLEMENTATION.md`** : Documentation technique complète
- **`VALIDATION_REPORT.md`** : Rapport de validation et conformité
- **`README.md`** : Ce fichier

---

## 🚀 Déploiement

Le projet est configuré pour un déploiement sur **Vercel** :

```bash
# Build de test
npm run build

# Déploiement automatique via Git
git add .
git commit -m "feat: Your message"
git push
```

Configuration automatiquement détectée par Vercel :
- Framework : Vite
- Build Command : `npm run build`
- Output Directory : `dist`

---

## 🔧 Configuration

### TypeScript

- **Strict mode** activé
- **verbatimModuleSyntax** pour imports corrects
- **Path aliases** : `@/*` → `./src/*`

### ESLint

- **0 erreurs** dans tout le projet
- **react-refresh** pour le HMR
- **TypeScript ESLint** pour la cohérence

### TailwindCSS

- **Utility-first** pour un développement rapide
- **Tree-shaking** automatique
- **Animations personnalisées** (slide-in, fade-in, scale-in)

---

## 🤝 Auteur

**Développé pour le test technique Wimi**

---

## 📝 Licence

Ce projet est développé dans le cadre d'un test technique.
