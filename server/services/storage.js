const fs = require('fs');

// ─── LIRE UN FICHIER JSON ────────────────────────────────
function readJSON(filePath) {
    // Si le fichier n'existe pas, retourne une liste vide
    if (!fs.existsSync(filePath)) return [];

    // Lit et convertit le fichier en objet JavaScript
    const data = fs.readFileSync(filePath, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error('Erreur lecture JSON :', err);
        return [];
    }
}

// ─── ÉCRIRE DANS UN FICHIER JSON ─────────────────────────
function writeJSON(filePath, data) {
    // Convertit l'objet JavaScript en texte et sauvegarde
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readJSON, writeJSON };