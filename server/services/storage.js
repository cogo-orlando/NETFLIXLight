const fs = require('fs');

// Lit un fichier JSON
function readJSON(filePath) {

    // Si le fichier n'existe pas, retourne une liste vide
    if (!fs.existsSync(filePath)) return [];

    // Lit et convertit le fichier en objet JavaScript
    const data = fs.readFileSync(filePath, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error('JSON reading error :', err);
        return [];
    }
}

// Ecrie dans un fichier JSON
function writeJSON(filePath, data) {

    // Convertit l'objet JavaScript en texte et sauvegarde
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readJSON, writeJSON };