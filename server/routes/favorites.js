const express = require("express");
const router = express.Router();

const { addFavorite, getFavorites } = require("../controllers/favoritesController");

router.post("/", addFavorite);

router.get("/", getFavorites);

module.exports = router;