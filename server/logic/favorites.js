const fs = require("fs");
const path = require("path");

// Fichier qui stock les favoris
const filePath = path.join(__dirname, "../stockage/favorites.json");

// Ajoute un favoris
exports.addFavorite = (req, res) => {
    const film = req.body;
    const favorites = JSON.parse(fs.readFileSync(filePath));

    // Vérifie que le film n'est pas déjà dans les favoris
    const dejaPresent = favorites.some(f => String(f.id) === String(film.id));
    if (dejaPresent) {
        return res.json({ message: "Already in favorites" });
    }

    // Ajoute le film
    favorites.push(film);
    fs.writeFileSync(filePath, JSON.stringify(favorites, null, 2));
    res.json({ message: "Movie added to favorites ✓" });
};

// Récupére les favoris
exports.getFavorites = (req, res) => {

    // Renvoie la liste des favoris
    const favorites = JSON.parse(fs.readFileSync(filePath));
    res.json(favorites);
};

// Supprimer un favoris
exports.removeFavorite = (req, res) => {
    const id = req.params.id;
    let favorites = JSON.parse(fs.readFileSync(filePath));

    // Garde tous les films sauf celui qui à été supprimer
    favorites = favorites.filter(film => String(film.id) !== String(id));
    fs.writeFileSync(filePath, JSON.stringify(favorites, null, 2));
    res.json({ message: "Film removed from favorites ✓" });
};