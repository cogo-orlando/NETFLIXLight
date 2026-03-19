const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

// Charge les variables d'environnement (.env)
dotenv.config();

const app = express();
const PORT = 3000;

// ─── CONFIGURATION ───────────────────────────────────────
// Permet de lire le JSON envoyé par le navigateur
app.use(express.json());

// Sert les fichiers du site (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../web')));

// Gère les sessions (pour retenir qui est connecté)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false
}));

// ─── ROUTES ──────────────────────────────────────────────
// Page des films
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../web/index.html'));
});

// Routes films
app.use('/api', require('./routes/movies.js'));

// Routes connexion/inscription
app.use('/auth', require('./routes/authentification.js'));

// Routes favoris
app.use('/api/favorites', require('./routes/favorites.js'));

// ─── PAGE D'ERREUR 404 ───────────────────────────────────
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../web/error.html'));
});

// ─── DÉMARRAGE ───────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🎬 Netflix Light tourne sur http://localhost:${PORT}`);
});