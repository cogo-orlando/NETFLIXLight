const express = require("express");
const router = express.Router();
const { addFavorite, getFavorites, removeFavorite } = require("../logic/favorites");

// ─── ROUTES FAVORIS ──────────────────────────────────────

router.get("/", getFavorites);          // Récupérer les favoris
router.post("/", addFavorite);          // Ajouter un favori
router.delete("/:id", removeFavorite);  // Supprimer un favori

module.exports = router;