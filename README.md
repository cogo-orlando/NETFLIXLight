# NetflixLight

Une plateforme de streaming vidéo inspirée de Netflix, construite en JavaScript, Node.js/Express et l'API TMDB.

---

## Aperçu

NetflixLight est un site web fonctionnel de plateforme de streaming. Il permet de naviguer dans un catalogue de films, de rechercher des contenus, de gérer une liste de favoris, et de visionner des bandes annonces. Les données proviennent de l'API TMDB.

---

## Fonctionnalités

- **Authentification** : inscription, connexion, gestion de session, routes protégées
- **Page d'accueil** : hero banner aléatoire (tendances, populaires, mieux notés, genres…)
- **Page détail** : synopsis, acteurs, films, ajout aux favoris, bande annonces
- **Recherche** : barre de recherche
- **Favoris** : ajout/suppression d'un film dans la page favoris
- **Bande annonce** : barre de progression, play/pause, volume, timer, plein écran

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| API externe | TMDB API |
| Stockage | JSON files (`users.json`, `favorites.json`) |

---

## Installation

1. **Cloner le dépôt**

```bash
git clone https://github.com/votre-org/netflixlight.git
cd netflixlight
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
# Puis renseigner les valeurs dans .env
```

4. **Lancer le serveur**

```bash
npm start
# ou en mode développement :
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

---

## Configuration de l'API TMDB

1. Créer un compte sur [themoviedb.org](https://www.themoviedb.org/)
2. Aller dans **Paramètres → API** et générer une clé API (type "Developer")
3. Renseigner les valeurs dans le fichier `.env` :

```env
TMDB_API_KEY=votre_clé_api_ici
TMDB_BASE_URL=https://api.themoviedb.org/3
SESSION_SECRET=une_chaîne_secrète_aléatoire
PORT=3000
```

## Architecture du projet

```
netflixlight/
│
├── server/                        # Backend Node.js / Express
│   ├── logic/                     # Logique métier (accès aux données)
│   │   ├── authentification.js    # Inscription, connexion, gestion des users
│   │   ├── favorites.js           # Lecture/écriture des favoris
│   │   └── movies.js              # Appels vers l'API TMDB
│   │
│   ├── routes/                    # Définition des routes Express
│   │   ├── authentification.js    # POST /api/auth/*
│   │   ├── favorites.js           # GET / POST / DELETE /api/favorites
│   │   └── movies.js              # GET /api/movies/*
│   │
│   ├── security/
│   │   └── security.js            # Middleware de vérification de session
│   │
│   ├── services/
│   │   └── storage.js             # Utilitaire lecture/écriture fichiers JSON
│   │
│   ├── stockage/                  # Persistance des données (JSON)
│   │   ├── favorites.json         # Favoris par utilisateur
│   │   ├── tmdb.js                # Cache / configuration TMDB
│   │   └── users.json             # Utilisateurs enregistrés
│   │
│   ├── .env                       # Variables d'environnement (non commité)
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                  # Point d'entrée Express
│
└── web/                           # Frontend (SPA vanilla JS)
    ├── css/                       # Feuilles de style
    ├── image/                     # Assets images
    ├── js/                        # Scripts JavaScript (routing, composants…)
    ├── details.html               # Page détail film / série
    ├── error.html                 # Page d'erreur 404
    ├── favorites.html             # Page Watchlist
    └── home.html                  # Page d'accueil
```

---

## Choix techniques

**JavaScript sans framework**
Le routing côté client est géré manuellement via l'API History sans librairie externe.

**Architecture logic / routes / security séparée**
La logique (`logic/`) est découplée des routes Express (`routes/`) et du middleware d'authentification (`security/`).

**Stockage JSON**
Les données utilisateurs et favoris sont stockées dans des fichiers JSON (`stockage/`), lus et écrits via un service dédié (`services/storage.js`). Ce choix simplifie le setup sans nécessiter de base de données.

**Clé API côté serveur uniquement**
La clé TMDB est conservée dans `.env` et n'est jamais exposée au navigateur. Le frontend communique exclusivement avec le backend Express, qui joue le rôle de proxy vers TMDB.

**Bande annonce**
Construit sur l'élément `<video>` natif, avec les contrôles HTML natifs désactivés et remplacés par une interface JavaScript sur mesure. 

---

## Documentation API backend

Toutes les routes sont préfixées par `/api`.

### Authentification

| Méthode | Route | Corps | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ email, pseudo, password }` | Inscription d'un nouvel utilisateur |
| `POST` | `/api/auth/login` | `{ email, password }` | Connexion, création de session |
| `POST` | `/api/auth/logout` | — | Déconnexion, destruction de session |
| `GET` | `/api/auth/me` | — | Retourne l'utilisateur connecté *(session requise)* |

### Films

| Méthode | Route | Paramètres | Description |
|---|---|---|---|
| `GET` | `/api/movies/trending` | — | Contenus tendances du moment |
| `GET` | `/api/movies/popular` | — | Films populaires |
| `GET` | `/api/movies/top-rated` | — | Films les mieux notés |
| `GET` | `/api/movies/genre/:id` | `id` : identifiant TMDB du genre | Films par genre |
| `GET` | `/api/movies/:id` | `id` : identifiant TMDB | Détail d'un film |
| `GET` | `/api/movies/search` | `?q=terme` | Recherche |

### Favoris

| Méthode | Route | Corps | Description |
|---|---|---|---|
| `GET` | `/api/favorites` | — | Récupère les favoris de l'utilisateur connecté |
| `POST` | `/api/favorites` | `{ tmdbId, type, title, poster }` | Ajoute un contenu aux favoris |
| `DELETE` | `/api/favorites/:tmdbId` | — | Supprime un contenu des favoris |

---

## Auteurs

Projet réalisé dans le cadre d'une formation développement web.
