# IMPLEMENTATION.md - Wimi Todo Manager

## Installation et Démarrage

### Prérequis

- **Node.js** v16 ou supérieur
- **npm** ou **yarn**

### Installation

1. **Cloner le dépôt**

```bash
git clone <repository-url>
cd wimi-frontend-test
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Démarrer le serveur mock API**

```bash
npm start
```

Le serveur API sera accessible sur `http://localhost:3001`

4. **Dans un nouveau terminal, démarrer l'application React**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Commandes Disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Compile l'application pour la production
npm run preview      # Prévisualise le build de production
npm start            # Démarre le serveur API mock (json-server)
npm test             # Lance les tests unitaires
npm run test:e2e     # Lance les tests end-to-end
```

---

## Identifiants de Test

Utilisez ces identifiants pour vous connecter :

| Email                  | Mot de passe | Nom        |
| ---------------------- | ----------- | ---------- |
| john.doe@example.com   | password123 | John Doe   |
| jane.smith@example.com | password123 | Jane Smith |
| bob.wilson@example.com | password123 | Bob Wilson |

---

## Architecture et Choix Techniques

### Stack Technique Choisie

#### Frontend
- **React 18.3** avec **TypeScript 5.6** (strict mode)
- **Vite 4.5** comme bundler
- **TailwindCSS 3.4** pour le styling

#### State Management & Forms
- **Zustand 5.0** avec middleware `persist`
- **React Router 7.11** pour le routing
- **React Hook Form 7.68** pour les formulaires

#### API & Utilitaires
- **Axios 1.13** pour les appels API
- **json-server** comme mock API

#### Animations & UX
- **Framer Motion** pour les animations et transitions

### Pourquoi ces Choix ?

#### React + TypeScript Strict
J'ai activé le strict mode de TypeScript pour forcer une meilleure qualité de code. Ça demande plus de rigueur sur les types, mais ça évite beaucoup de bugs en production.

#### Vite vs Create React App
J'ai opté pour Vite principalement pour la vitesse. Le Hot Module Replacement est vraiment instantané comparé à CRA, et le temps de build est divisé par 3-4. Pour un projet moderne, c'est un choix évident.

#### Zustand vs Redux
Pour un projet de cette taille, Zustand est largement suffisant. C'est beaucoup plus léger (1KB vs 8KB pour Redux), l'API est plus simple, et il n'y a presque pas de boilerplate. Le middleware `persist` gère la persistance dans localStorage sans configuration complexe.

#### TailwindCSS
J'ai choisi Tailwind pour plusieurs raisons :
- Développement rapide avec les utility classes
- Design system cohérent par défaut
- Tree-shaking automatique (seul le CSS utilisé est dans le bundle final)
- Pas besoin de gérer des fichiers CSS séparés

#### React Hook Form
Comparé à d'autres solutions (Formik, etc.), React Hook Form provoque beaucoup moins de re-renders. La validation est intégrée et l'API avec `register` est vraiment intuitive.

#### Framer Motion
J'ai ajouté Framer Motion pour améliorer l'expérience utilisateur avec des animations fluides. C'est une librairie légère qui utilise l'accélération GPU et qui s'intègre parfaitement avec React. Les animations rendent l'application plus vivante et professionnelle.

---

## Architecture des Dossiers

```
src/
├── components/
│   ├── ui/                    # Composants réutilisables (Button, Input, etc.)
│   └── features/              # Composants métier (LoginForm, TodoList, etc.)
├── pages/                     # Pages de l'application
├── services/                  # Logique API isolée
├── store/                     # State management global (Zustand)
├── types/                     # Définitions TypeScript
├── utils/                     # Fonctions utilitaires
├── App.tsx                    # Router + Routes protégées
└── main.tsx                   # Point d'entrée
```

### Principes Appliqués

**Séparation des préoccupations** : J'ai bien séparé les composants UI génériques (`components/ui/`) des composants métier (`components/features/`). Ça facilite la réutilisation et les tests.

**Services isolés** : Toute la logique d'API est dans le dossier `services/`. Les composants ne font qu'appeler ces services, ce qui rend le code plus maintenable.

**Type safety** : Tous les modèles de données (User, TodoList, Todo) ont des interfaces TypeScript dans le dossier `types/`. Pas d'usage de `any` dans le projet.

---

## Fonctionnalités Implémentées

### Features Requises ✅

#### 1. Page de Connexion
- Formulaire email + mot de passe avec validation
- Gestion des erreurs API avec messages clairs
- Redirection automatique après connexion réussie
- État de chargement (spinner dans le bouton)
- Persistance de la session dans localStorage

#### 2. Vue Principale - Listes & Tâches
- Affichage des listes de l'utilisateur connecté
- Affichage des tâches pour chaque liste
- Marquer une tâche comme complétée (optimistic UI)
- **Créer une nouvelle tâche** (feature principale)
- **Modifier une tâche existante** (tous les champs éditables)
- Supprimer une tâche avec confirmation
- Tri automatique par priorité et date
- Statistiques par liste (X/Y tâches terminées)

#### 3. Sidebar - Informations Utilisateur
- Avatar avec fallback sur les initiales
- Nom complet et rôle de l'utilisateur
- Bouton de déconnexion fonctionnel

### Features Bonus Ajoutées

**Optimistic UI** : L'interface se met à jour immédiatement quand on coche une tâche, sans attendre le serveur. Si l'API échoue, ça rollback automatiquement.

**Notifications Toast** : J'ai ajouté un système de notifications qui s'affiche en haut à droite pour confirmer les actions (création, suppression, erreurs). Elles disparaissent automatiquement après 3 secondes.

**Édition de Tâches** : Un modal d'édition permet de modifier tous les champs d'une tâche (titre, description, priorité, date). Le formulaire est pré-rempli avec les valeurs actuelles et valide en temps réel.

**Dialogues de Confirmation** : Une modale s'affiche avant de supprimer une tâche pour éviter les erreurs.

**Animations (Framer Motion)** : J'ai intégré des animations fluides sur toute l'interface - transitions entre pages, apparitions progressives des éléments, effet hover sur les boutons. Ça rend l'application plus vivante sans ralentir les performances.

**Validation des formulaires** : Les champs sont validés en temps réel avec des messages d'erreur clairs. Par exemple, on ne peut pas mettre une date d'échéance dans le passé.

**Loading states et UX** : J'ai ajouté des spinners pendant les chargements, les boutons d'action apparaissent au survol, et l'interface s'adapte au mobile. Quand on crée une tâche, la liste se scroll automatiquement vers celle-ci.

---

## Tests Implémentés

J'ai ajouté des tests pour valider la feature principale (création de tâches).

### Tests Unitaires (Vitest + React Testing Library)

**Fichier** : `src/components/features/todos/__tests__/TodoForm.test.tsx`

- **Test 1** : Validation du formulaire (champs requis, messages d'erreur)
- **Test 2** : Création réussie d'une tâche (remplissage + soumission)

```bash
npm test              # Lancer en mode watch
npm test -- --run     # Une seule fois
npm run test:ui       # Interface interactive
```

### Test E2E (Playwright)

**Fichier** : `e2e/todo-creation-simple.spec.ts`

Test du flow complet :
1. Login avec identifiants valides
2. Ouverture du formulaire de création
3. Remplissage de tous les champs
4. Soumission et validation

```bash
npm run test:e2e      # Lancer les tests
npm run test:e2e:ui   # Mode interactif
```

**Note** : C'était ma première fois avec Playwright, la configuration m'a pris un moment mais une fois en place c'est vraiment puissant pour tester les flows utilisateurs.

---

## Défis Techniques Rencontrés

### 1. Optimistic UI avec Rollback
Le plus intéressant à implémenter. J'ai dû :
- Mettre à jour l'état local immédiatement (checkbox cochée)
- Appeler l'API en arrière-plan
- Gérer le rollback si l'API échoue
- Afficher un message d'erreur temporaire

C'était nouveau pour moi mais le résultat donne une UX vraiment fluide.

### 2. TypeScript Strict Mode
Quelques galères avec les types, notamment :
- Les props de React Router qui sont parfois complexes
- Les types des événements de formulaire
- L'intégration de `@testing-library/jest-dom` avec Vitest

Mais globalement ça force à écrire du code plus robuste, donc je trouve que ça vaut le coup.

### 3. Build pour Vercel
Initialement, le build échouait car TypeScript compilait aussi les fichiers de tests. J'ai dû :
- Modifier le script `build` pour exclure `tsc`
- Laisser Vite gérer le type checking (plus rapide)
- Créer un script `build:check` pour le type checking local

### 4. Tests E2E avec Playwright
La configuration de Playwright était nouvelle pour moi. J'ai appris à :
- Configurer le serveur de développement pour les tests
- Utiliser les sélecteurs de manière robuste
- Gérer les états de chargement dans les tests

### 5. Système de Notifications Toast
J'ai créé un système de toasts avec Context API et Portal React. L'idée est d'afficher les notifications au-dessus de tout le DOM. C'était un bon exercice pour comprendre les Portals.

### 6. Intégration Framer Motion
Framer Motion s'intègre facilement. J'ai surtout utilisé les `motion` components et le stagger pour les listes. Le résultat est satisfaisant avec peu de code.

---

## Retour d'Expérience

### Ce que j'ai apprécié

**Zustand** : Beaucoup plus simple que Redux, et le middleware `persist` fonctionne nickel.

**React Hook Form** : La validation intégrée fait gagner beaucoup de temps.

**Optimistic UI** : Je l'avais peu utilisé avant, mais le rendu immédiat améliore vraiment l'UX.

### Ce que je ferais différemment

Avec plus de temps, j'utiliserais **React Query** pour gérer le cache API et éviter de recharger les données. J'ajouterais aussi **Storybook** pour documenter les composants UI, et plus de tests sur les services.

---

## Améliorations Futures

Avec plus de temps, j'ajouterais :
- **Filtres et recherche** : Filtrer les tâches par statut ou rechercher par titre
- **Gestion des listes** : Créer/modifier/supprimer ses propres listes
- **Dark Mode** : Un thème sombre avec persistance
- **Drag & Drop** : Réorganiser les tâches par glisser-déposer
- **Lazy Loading** : Charger les pages à la demande pour améliorer les perfs
- **CI/CD** : GitHub Actions pour automatiser les tests

---

## Configuration Vercel

Le projet est prêt pour le déploiement sur Vercel.

**Configuration automatique détectée** :
- Framework : Vite
- Build Command : `npm run build`
- Output Directory : `dist`

**Important** : L'API mock (json-server) ne sera pas déployée. Pour la production, il faudrait :
- Déployer le backend séparément (Heroku, Railway, Render)
- Configurer la variable d'environnement `VITE_API_URL`

---

## Métriques du Build

**Taille du bundle** :
- JavaScript : 265 KB (89 KB gzippé)
- CSS : 18 KB (4 KB gzippé)
- Total gzippé : ~94 KB

**Performance** :
- Build time : ~3s
- Dev server startup : <1s
- Hot reload : instantané

---

## Ressources Utilisées

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Playwright](https://playwright.dev/)

---

## Informations Projet

**Durée de réalisation** : ~6 heures  
**Date** : Janvier 2025  
**Stack** : React + TypeScript + TailwindCSS + Zustand  

---

Merci d'avoir pris le temps d'évaluer ce projet ! 🚀
