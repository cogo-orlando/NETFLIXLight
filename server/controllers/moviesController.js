const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getTrending(req, res) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        const films = data.results.map(film => ({
            id: film.id,
            titre: film.title,
            poster: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
            date_sortie: film.release_date,
            note: film.vote_average
        }));
        res.json({ message: "Films trending", films });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getMovieDetails(req, res) {
    const id = req.params.id;
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const film = await response.json();

        const creditsResp = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
        const credits = await creditsResp.json();
        const acteurs = credits.cast.slice(0,5).map(a => a.name);

        res.json({
            id: film.id,
            titre: film.title,
            synopsis: film.overview,
            poster: film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : null,
            date_sortie: film.release_date,
            note: film.vote_average,
            genres: film.genres.map(g => g.name),
            acteurs: acteurs
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getTrending, getMovieDetails };