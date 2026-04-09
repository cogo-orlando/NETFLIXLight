const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const WEB = path.join (__dirname, '../web');

// Charge les variables d'environnement (.env)
dotenv.config();

const app = express();
const PORT = 3000;

// Configuration

// Permet de lire le JSON envoyé par le navigateur
app.use(express.json());

// Gère les sessions = pour savoir qui est connecter
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false
}));

// Pages
app.get('/', (req, res) => res.sendFile(`${WEB}/home.html`)); // Page home
app.get('/films', (req, res) => res.sendFile(`${WEB}/index.html`)); // Page des films

// Routes
app.use('/api', require('./routes/movies.js')); // Routes films
app.use('/auth', require('./routes/authentification.js')); // Routes connexion/inscription
app.use('/api/favorites', require('./routes/favorites.js')); // Routes favoris

// Permet d'exporter les fichiers (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../web')));

// PAGE ERREUR 404
app.use((req, res) => res.status(404).sendFile(`${WEB}/error.html`));

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🎬 NetflixLight runs on http://localhost:${PORT}`);
});