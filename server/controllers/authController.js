const path = require('path');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../utils/fileHandler.js');
const usersFile = path.join(__dirname, '../config/users.json');

async function registerUser(req, res) {
    const { email, pseudo, password } = req.body;
    if (!email || !pseudo || !password) return res.status(400).json({ error: "Champs manquants" });

    const users = readJSON(usersFile);
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "Utilisateur existant" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, pseudo, password: hashedPassword });
    writeJSON(usersFile, users);

    req.session.user = { email, pseudo };
    res.json({ message: "Inscription réussie", user: { email, pseudo } });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const users = readJSON(usersFile);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: "Utilisateur non trouvé" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Mot de passe incorrect" });

    req.session.user = { email, pseudo: user.pseudo, avatar: user.avatar || "🎬" };
    res.json({ message: "Connexion réussie", user: { email, pseudo: user.pseudo, avatar: user.avatar || "🎬" } });
}

// ← AJOUT
function logoutUser(req, res) {
    req.session.destroy();
    res.json({ success: true });
}

async function registerUser(req, res) {
    const { email, pseudo, password, avatar } = req.body;
    if (!email || !pseudo || !password) return res.status(400).json({ error: "Champs manquants" });

    const users = readJSON(usersFile);
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "Utilisateur existant" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, pseudo, password: hashedPassword, avatar: avatar || "🎬" });
    writeJSON(usersFile, users);

    req.session.user = { email, pseudo, avatar: avatar || "🎬" };
    res.json({ message: "Inscription réussie", user: { email, pseudo, avatar: avatar || "🎬" } });
}

module.exports = { registerUser, loginUser, logoutUser };