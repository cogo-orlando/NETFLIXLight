const express = require("express");
const router = express.Router();
const { addFavorite, getFavorites, removeFavorite } = require("../logic/favorites");

// Routes favoris

router.get("/", getFavorites);          // Récupére les favoris
router.post("/", addFavorite);          // Ajoute un favori
router.delete("/:id", removeFavorite);  // Supprime un favori

module.exports = router;