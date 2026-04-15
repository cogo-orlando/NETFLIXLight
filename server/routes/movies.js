const express = require('express');
const router = express.Router();
const { getTrending, getMovieDetails, getByGenre, getTopRated, getMovieTrailer } = require('../logic/movies.js');

// Routes films

router.get('/trending',          getTrending);       // Films en tendance
router.get('/toprated',          getTopRated);       // Films les mieux notés
router.get('/genres',            getByGenre);        // Films genre
router.get('/movie/:id',         getMovieDetails);   // Détails d'un film
router.get('/movie/:id/trailer', getMovieTrailer);   // Trailer d'un film

module.exports = router;