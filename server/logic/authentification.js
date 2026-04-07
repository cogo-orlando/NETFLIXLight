const path = require('path');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../services/storage.js');

// Fichier qui stocke les utilisateurs
const usersFile = path.join(__dirname, '../stockage/users.json');

// Inscription
async function registerUser(req, res) {
    const { email, pseudo, password } = req.body;

    // Vérifie que tous les champs sont remplis
    if (!email || !pseudo || !password)
        return res.status(400).json({ error: "Missing fields" });

    const users = readJSON(usersFile);

    // Vérifie que l'email n'est pas déjà utilisé
    if (users.find(u => u.email === email))
        return res.status(400).json({ error: "Existing user" });

    // Chiffre le mot de passe avant de le sauvegarder
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajoute le nouvel utilisateur
    users.push({
        email,
        pseudo,
        password: hashedPassword,
    });

    writeJSON(usersFile, users);

    // Démarre la session
    req.session.user = { email, pseudo, };
    res.json({ message: "Successful signup", user: { email, pseudo, } });
}

// Connexion
async function loginUser(req, res) {
    const { email, password } = req.body;
    const users = readJSON(usersFile);

    // Cherche l'utilisateur par email
    const user = users.find(u => u.email === email);
    if (!user)
        return res.status(400).json({ error: "User not found" });

    // Vérifie le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
        return res.status(400).json({ error: "Incorrect password" });

    // Démarre la session
    req.session.user = { email, pseudo: user.pseudo, };
    res.json({ message: "Login successful", user: { email, pseudo: user.pseudo, } });
}

// Déconnexion
function logoutUser(req, res) {
    req.session.destroy(); // Supprime la session
    res.json({ success: true });
}

module.exports = { registerUser, loginUser, logoutUser, };