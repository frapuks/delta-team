# Delta Team

Application web de gestion des joueurs et de répartition en équipes pour des sessions sportives. Les données sont synchronisées en temps réel entre tous les utilisateurs via Firebase Firestore.

## Fonctionnalités

- **Gestion des joueurs** — ajout, édition, suppression, affectation à un groupe (1 à 4).
- **Suivi de présence et blessures** — marquer un joueur présent/absent ou blessé ; un joueur blessé est automatiquement retiré de son équipe et marqué absent.
- **Répartition en équipes** — assigner chaque joueur présent et valide à l'une des 4 équipes, ou le laisser « En attente ».
- **Verrouillage d'équipe** — verrouiller une équipe une fois sa composition figée, pour empêcher toute modification ultérieure.
- **Vues filtrées par onglets** — Tous, Dispo, À répartir, Équipe 1-4, avec compteur dynamique.
- **Copie rapide** — copier la liste des noms de l'onglet courant dans le presse-papiers.
- **Réinitialisation globale** — remettre tous les joueurs en attente, absents, et déverrouiller les équipes.
- **Synchronisation temps réel** — toutes les modifications sont propagées instantanément via Firestore `onSnapshot`.

## Stack technique

- **React 19** + **TypeScript** — UI et typage.
- **Vite 8** — bundler et serveur de dev.
- **Material UI 7** (`@mui/material`, `@mui/icons-material`, `@emotion`) — composants et thème.
- **Firebase 12** — Firestore pour le stockage, Hosting pour le déploiement.
- **ESLint 9** + **typescript-eslint** — linting.

## Structure du projet

```
delta_team/
├── src/
│   ├── main.tsx                 # Point d'entrée React
│   ├── App.tsx                  # Layout principal
│   ├── firebase.ts              # Initialisation Firebase/Firestore
│   ├── types.ts                 # Types Player et Teams
│   ├── utils.ts                 # Helpers Firestore (update, reset)
│   ├── PlayersTabs.tsx          # Onglets + abonnement Firestore
│   ├── PlayersTable.tsx         # Tableau des joueurs (édition inline)
│   ├── AddPlayerDialog.tsx      # Dialog d'ajout de joueur
│   ├── EditPlayerDialog.tsx     # Dialog d'édition/suppression
│   ├── CopyPlayersButton.tsx    # Copie des noms dans le presse-papiers
│   ├── ResetTeamsButton.tsx     # Réinitialisation globale (batch)
│   └── TeamLockSwitches.tsx     # Switches de verrouillage des équipes
├── public/                      # Assets statiques (favicon, icons)
├── firebase.json                # Config Firebase Hosting
├── vite.config.ts
├── tsconfig*.json
└── package.json
```

## Modèle de données

Deux collections Firestore sont utilisées.

### Collection `players`

| Champ     | Type      | Description                                          |
|-----------|-----------|------------------------------------------------------|
| `id`      | `string`  | Identifiant Firestore                                |
| `name`    | `string`  | Nom du joueur                                        |
| `group`   | `number`  | Groupe d'appartenance : `1`, `2`, `3` ou `4`         |
| `team`    | `number`  | Équipe assignée : `0` (en attente), `1`, `2`, `3`, `4` |
| `present` | `boolean` | Présent à la session                                 |
| `injured` | `boolean` | Blessé (indisponible)                                |

### Collection `teams`

| Champ      | Type      | Description                              |
|------------|-----------|------------------------------------------|
| `id`       | `string`  | Identifiant Firestore                    |
| `name`     | `string`  | Nom affiché de l'équipe                  |
| `number`   | `number`  | Numéro de l'équipe : `1`, `2`, `3` ou `4` |
| `isLocked` | `boolean` | Empêche la modification des affectations |

## Règles métier

- Un joueur **blessé** est automatiquement marqué absent et retiré de son équipe.
- Un joueur **absent** est retiré de son équipe lorsqu'il bascule à absent.
- Le Select d'équipe est désactivé si le joueur est blessé, absent, ou si l'équipe courante est verrouillée.
- Une équipe verrouillée n'apparaît pas comme destination sélectionnable.
- Le bouton **Réinitialiser** remet tous les joueurs en `team: 0, present: false` et déverrouille toutes les équipes, en une seule opération batch Firestore.

## Installation

```bash
npm install
```

## Variables d'environnement

Créer un fichier `.env` à la racine avec les clés Firebase du projet :

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Les collections `players` et `teams` doivent exister dans Firestore. Les 4 documents `teams` doivent être créés manuellement (avec `name`, `number` de 1 à 4, `isLocked: false`).

## Scripts

| Commande          | Description                                    |
|-------------------|------------------------------------------------|
| `npm run dev`     | Démarre le serveur de développement Vite       |
| `npm run build`   | Compile TypeScript et génère la version de prod |
| `npm run preview` | Sert localement la version buildée              |
| `npm run lint`    | Exécute ESLint sur le projet                   |

## Déploiement

Le projet est configuré pour Firebase Hosting (dossier `dist/`).

```bash
npm run build
firebase deploy
```
