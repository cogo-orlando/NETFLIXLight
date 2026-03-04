const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const openBrowser = (...args) => import('open').then(({ default: open }) => open(...args));

dotenv.config();
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false
}));

// Routes
app.use('/api', require('./routes/movies.js'));
app.use('/auth', require('./routes/auth.js'));

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🎬 Netflix Light fonctionne sur le port ${PORT}`);

    // ouvrir le navigateur avec import dynamique
    openBrowser(`http://localhost:${PORT}/`).catch(err => console.error("Impossible d'ouvrir le navigateur :", err));
});