const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../config/favorites.json");

exports.addFavorite = (req, res) => {

    const movie = req.body;

    const favorites = JSON.parse(fs.readFileSync(filePath));

    favorites.push(movie);

    fs.writeFileSync(filePath, JSON.stringify(favorites, null, 2));

    res.json({ message: "Film ajouté aux favoris" });

};

exports.getFavorites = (req, res) => {

    const favorites = JSON.parse(fs.readFileSync(filePath));

    res.json(favorites);

};