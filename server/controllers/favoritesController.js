const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../config/favorites.json");

exports.addFavorite = (req, res) => {
    const movie = req.body;
    const favorites = JSON.parse(fs.readFileSync(filePath));
    const existe = favorites.some(f => String(f.id) === String(movie.id));
    if (existe) {
        return res.json({ message: "Déjà dans les favoris" });
    }
    favorites.push(movie);
    fs.writeFileSync(filePath, JSON.stringify(favorites, null, 2));
    res.json({ message: "Film ajouté aux favoris" });
};

exports.getFavorites = (req, res) => {

    const favorites = JSON.parse(fs.readFileSync(filePath));

    res.json(favorites);

};

exports.removeFavorite = (req, res) => {
    const id = req.params.id;
    let favorites = JSON.parse(fs.readFileSync(filePath));
    favorites = favorites.filter(film => String(film.id) !== String(id));
    fs.writeFileSync(filePath, JSON.stringify(favorites, null, 2));
    res.json({ message: "Film retiré des favoris" });
};