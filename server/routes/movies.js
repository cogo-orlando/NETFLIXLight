const express = require('express');
const router = express.Router();
const { getTrending, getMovieDetails, getByGenre, getTopRated, getMovieTrailer } = require('../controllers/moviesController.js');

router.get('/movie/:id/trailer', getMovieTrailer);
router.get('/genres', getByGenre);
router.get('/toprated', getTopRated);
router.get('/trending', getTrending);
router.get('/movie/:id', getMovieDetails);

module.exports = router;