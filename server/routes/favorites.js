const express = require("express");
const router = express.Router();

const { addFavorite, getFavorites, removeFavorite } = require("../controllers/favoritesController");
router.delete("/:id", removeFavorite);

router.post("/", addFavorite);

router.get("/", getFavorites);

module.exports = router;