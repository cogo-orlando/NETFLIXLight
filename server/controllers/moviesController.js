const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getTrending(req, res) {
    try {
        // Récupère 3 pages = 60 films
        const pages = [1, 2, 3,4 ,5];

        const responses = await Promise.all(
            pages.map(page =>
                fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`)
                    .then(r => r.json())
            )
        );

        const films = responses
            .flatMap(data => data.results)
            .filter(film => film.poster_path) // ignore les films sans affiche
            .map(film => ({
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

async function getByGenre(req, res) {
    const genres = {
        action: 28,
        comedy: 35,
        horror: 27,
        scifi: 878,
        drama: 18
    };
    try {
        const results = await Promise.all(
            Object.entries(genres).map(([name, id]) =>
                fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${id}&sort_by=popularity.desc&language=fr-FR&page=1`)
                    .then(r => r.json())
                    .then(data => ({
                        categorie: name,
                        films: data.results.filter(f => f.poster_path).slice(0, 20).map(film => ({
                            id: film.id,
                            titre: film.title,
                            poster: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
                            date_sortie: film.release_date,
                            note: film.vote_average
                        }))
                    }))
            )
        );
        res.json({ categories: results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getTopRated(req, res) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`);
        const data = await response.json();
        const films = data.results.filter(f => f.poster_path).slice(0, 20).map(film => ({
            id: film.id,
            titre: film.title,
            poster: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
            date_sortie: film.release_date,
            note: film.vote_average
        }));
        res.json({ films });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getMovieTrailer(req, res) {
    const id = req.params.id;
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const data = await response.json();

        let trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        if (!trailer) {
            const enResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
            const enData = await enResponse.json();
            trailer = enData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        }

        res.json({ trailerKey: trailer ? trailer.key : null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getTrending, getMovieDetails, getByGenre, getTopRated, getMovieTrailer };