// ─── CONFIGURATION API TMDB ──────────────────────────────

const API_KEY = process.env.TMDB_API_KEY; // Clé secrète pour accéder à TMDB
const BASE_URL = "https://api.themoviedb.org/3"; // Adresse de base de l'API

module.exports = { API_KEY, BASE_URL };