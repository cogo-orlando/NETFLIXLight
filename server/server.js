const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
const PORT = 3000;

// fetch compatible Node 24 avec require
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// open compatible CommonJS
const openBrowser = (...args) => import('open').then(({ default: open }) => open(...args));

// Route pour les films trending
app.get('/api/trending', async (req, res) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
        );
        const data = await response.json();

        const films = data.results.map(film => ({
            id: film.id,
            titre: film.title,
            poster: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
            date_sortie: film.release_date,
            note: film.vote_average
        }));

        res.json({ message: "Voici la liste des films trending !", films });
    } catch (error) {
        console.error("Erreur fetch TMDB:", error);
        res.status(500).json({ error: "Impossible de récupérer les films", details: error.message });
    }
});

app.get('/api/movie/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
        );
        const film = await response.json();

        const creditsResp = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}`
        );
        const creditsData = await creditsResp.json();

        const acteurs = creditsData.cast
            .slice(0, 5)
            .map(a => a.name);

        res.json({
            id: film.id,
            titre: film.title,
            synopsis: film.overview,
            poster: film.poster_path
                ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
                : null,
            date_sortie: film.release_date,
            note: film.vote_average,
            genres: film.genres.map(g => g.name),
            acteurs: acteurs
        });

    } catch (error) {
        console.error("Erreur détail serveur :", error);
        res.status(500).json({ error: "Impossible de récupérer le film" });
    }
});

app.get('/favicon.ico', (req, res) => res.status(204));

// Sert les fichiers statiques du client
app.use(express.static(path.join(__dirname, '../client/')));

// Démarre le serveur et ouvre le navigateur sur index.html
app.listen(PORT, async () => {
    console.log(`🎬 API Netflix Light fonctionne sur le port ${PORT} !`);
    try {
        await openBrowser(`http://localhost:${PORT}/`); // <- ici on ouvre index.html
    } catch (err) {
        console.error("Impossible d'ouvrir le navigateur :", err);
    }
});
