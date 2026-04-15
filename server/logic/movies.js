const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Clé API pour accéder à la base de données de films TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Films tendances
async function getTrending(req, res) {
    try {
        // Récupère 5 pages de films tendance (100 films au total) (1 pages = 20 films)
        const pages = [1, 2, 3, 4, 5];

        const reponses = await Promise.all(
            pages.map(page =>
                fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`)
                    .then(r => r.json())
            )
        );

        // Formate les données pour garder que l'essentiel
        const films = reponses
            .flatMap(data => data.results)
            .filter(film => film.poster_path) // ignore les films sans affiche
            .map(film => ({
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

// Détails d'un film
async function getMovieDetails(req, res) {
    const id = req.params.id;
    try {
        // Récupère les infos du film
        const reponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const film = await reponse.json();

        // Récupèrer les 5 premiers acteurs du film
        const creditsReponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
        const credits = await creditsReponse.json();
        const acteurs = credits.cast.slice(0, 10).map(a => a.name);

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

// Film genre
async function getByGenre(req, res) {

    // Liste des genres avec leur ID TMDB
    const genres = {
        action: 28,
        comedy: 35,
        horror: 27,
        scifi: 878,
        drama: 18
    };

    try {
        // Récupère 20 films pour chaque genre
        const resultats = await Promise.all(
            Object.entries(genres).map(([nom, id]) =>
                fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${id}&sort_by=popularity.desc&language=fr-FR`)
                    .then(r => r.json())
                    .then(data => ({
                        categorie: nom,
                        films: data.results
                            .filter(f => f.poster_path)
                            .slice(0, 20)
                            .map(film => ({
                                id: film.id,
                                titre: film.title,
                                poster: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
                                date_sortie: film.release_date,
                                note: film.vote_average
                            }))
                    }))
            )
        );

        res.json({ categories: resultats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Film les mieux notés
async function getTopRated(req, res) {
    try {
        const reponse = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const data = await reponse.json();

        const films = data.results
            .filter(f => f.poster_path)
            .slice(0, 20)
            .map(film => ({
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

// Bande d'annonce d'un film
async function getMovieTrailer(req, res) {
    const id = req.params.id;
    try {
        // Cherche un trailer en français
        const reponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const data = await reponse.json();
        let trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        // Si pas de trailer en français, cherche en anglais
        if (!trailer) {
            const reponseEn = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
            const dataEn = await reponseEn.json();
            trailer = dataEn.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        }

        res.json({ trailerKey: trailer ? trailer.key : null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getTrending, getMovieDetails, getByGenre, getTopRated, getMovieTrailer };