const express = require('express');
const router = express.Router();
const { getTrending, getMovieDetails } = require('../controllers/moviesController.js');

router.get('/trending', getTrending);
router.get('/movie/:id', getMovieDetails);

module.exports = router;