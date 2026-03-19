const path = require('path');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../services/storage.js');

// Fichier qui stocke les utilisateurs
const usersFile = path.join(__dirname, '../stockage/users.json');

// ─── INSCRIPTION ─────────────────────────────────────────
async function registerUser(req, res) {
    const { email, pseudo, password, avatar } = req.body;

    // Vérifie que tous les champs sont remplis
    if (!email || !pseudo || !password)
        return res.status(400).json({ error: "Champs manquants" });

    const users = readJSON(usersFile);

    // Vérifie que l'email n'est pas déjà utilisé
    if (users.find(u => u.email === email))
        return res.status(400).json({ error: "Utilisateur existant" });

    // Chiffre le mot de passe avant de le sauvegarder
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajoute le nouvel utilisateur
    users.push({
        email,
        pseudo,
        password: hashedPassword,
        avatar: avatar || "🎬",
        dateInscription: new Date().toISOString()
    });

    writeJSON(usersFile, users);

    // Démarre la session
    req.session.user = { email, pseudo, avatar: avatar || "🎬" };
    res.json({ message: "Inscription réussie", user: { email, pseudo, avatar: avatar || "🎬" } });
}

// ─── CONNEXION ───────────────────────────────────────────
async function loginUser(req, res) {
    const { email, password } = req.body;
    const users = readJSON(usersFile);

    // Cherche l'utilisateur par email
    const user = users.find(u => u.email === email);
    if (!user)
        return res.status(400).json({ error: "Utilisateur non trouvé" });

    // Vérifie le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
        return res.status(400).json({ error: "Mot de passe incorrect" });

    // Démarre la session
    req.session.user = { email, pseudo: user.pseudo, avatar: user.avatar || "🎬" };
    res.json({ message: "Connexion réussie", user: { email, pseudo: user.pseudo, avatar: user.avatar || "🎬" } });
}

// ─── DÉCONNEXION ─────────────────────────────────────────
function logoutUser(req, res) {
    req.session.destroy(); // Supprime la session
    res.json({ success: true });
}

// ─── MODIFIER LE PROFIL ──────────────────────────────────
async function updateProfile(req, res) {
    const { pseudo, avatar } = req.body;
    const email = req.session.user?.email;

    // Vérifie que l'utilisateur est connecté
    if (!email)
        return res.status(401).json({ error: "Non connecté" });

    let users = readJSON(usersFile);
    const index = users.findIndex(u => u.email === email);

    // Met à jour le pseudo et l'avatar
    if (pseudo) users[index].pseudo = pseudo;
    if (avatar) users[index].avatar = avatar;

    writeJSON(usersFile, users);

    // Met à jour la session
    req.session.user = { ...req.session.user, pseudo: users[index].pseudo, avatar: users[index].avatar };
    res.json({ message: "Profil mis à jour ✓", user: req.session.user });
}

// ─── CHANGER LE MOT DE PASSE ─────────────────────────────
async function changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const email = req.session.user?.email;

    if (!email)
        return res.status(401).json({ error: "Non connecté" });

    let users = readJSON(usersFile);
    const user = users.find(u => u.email === email);

    // Vérifie l'ancien mot de passe
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid)
        return res.status(400).json({ error: "Ancien mot de passe incorrect" });

    // Chiffre et sauvegarde le nouveau mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    writeJSON(usersFile, users);
    res.json({ message: "Mot de passe changé ✓" });
}

// ─── SUPPRIMER LE COMPTE ─────────────────────────────────
async function deleteAccount(req, res) {
    const email = req.session.user?.email;

    if (!email)
        return res.status(401).json({ error: "Non connecté" });

    let users = readJSON(usersFile);

    // Supprime l'utilisateur de la liste
    users = users.filter(u => u.email !== email);
    writeJSON(usersFile, users);

    req.session.destroy();
    res.json({ success: true });
}

module.exports = { registerUser, loginUser, logoutUser, updateProfile, changePassword, deleteAccount };