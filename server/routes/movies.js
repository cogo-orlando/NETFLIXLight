const express = require('express');
const router = express.Router();
const { getTrending, getMovieDetails, getByGenre, getTopRated, getMovieTrailer } = require('../logic/movies.js');

// ─── ROUTES FILMS ─────────────────────────────────────────

router.get('/trending',          getTrending);       // Films tendance
router.get('/toprated',          getTopRated);       // Films les mieux notés
router.get('/genres',            getByGenre);        // Films par genre
router.get('/movie/:id',         getMovieDetails);   // Détails d'un film
router.get('/movie/:id/trailer', getMovieTrailer);   // Bande annonce d'un film

module.exports = router;