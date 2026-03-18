const path = require('path');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../utils/fileHandler.js');
const usersFile = path.join(__dirname, '../config/users.json');

async function registerUser(req, res) {
    const { email, pseudo, password, avatar } = req.body;
    if (!email || !pseudo || !password) return res.status(400).json({ error: "Champs manquants" });

    const users = readJSON(usersFile);
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "Utilisateur existant" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, pseudo, password: hashedPassword, avatar: avatar || "🎬", dateInscription: new Date().toISOString() });
    writeJSON(usersFile, users);

    req.session.user = { email, pseudo, avatar: avatar || "🎬" };
    res.json({ message: "Inscription réussie", user: { email, pseudo, avatar: avatar || "🎬" } });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const users = readJSON(usersFile);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: "Utilisateur non trouvé" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Mot de passe incorrect" });

    req.session.user = { email, pseudo: user.pseudo, avatar: user.avatar || "🎬", dateInscription: user.dateInscription };
    res.json({ message: "Connexion réussie", user: { email, pseudo: user.pseudo, avatar: user.avatar || "🎬" } });
}

function logoutUser(req, res) {
    req.session.destroy();
    res.json({ success: true });
}

async function updateProfile(req, res) {
    const { pseudo, avatar } = req.body;
    const email = req.session.user?.email;
    if (!email) return res.status(401).json({ error: "Non connecté" });

    let users = readJSON(usersFile);
    const index = users.findIndex(u => u.email === email);
    if (index === -1) return res.status(404).json({ error: "Utilisateur introuvable" });

    if (pseudo) users[index].pseudo = pseudo;
    if (avatar) users[index].avatar = avatar;

    writeJSON(usersFile, users);
    req.session.user = { ...req.session.user, pseudo: users[index].pseudo, avatar: users[index].avatar };

    res.json({ message: "Profil mis à jour ✓", user: req.session.user });
}

async function changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const email = req.session.user?.email;
    if (!email) return res.status(401).json({ error: "Non connecté" });

    let users = readJSON(usersFile);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) return res.status(400).json({ error: "Ancien mot de passe incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    writeJSON(usersFile, users);
    res.json({ message: "Mot de passe changé ✓" });
}

async function deleteAccount(req, res) {
    const email = req.session.user?.email;
    if (!email) return res.status(401).json({ error: "Non connecté" });

    let users = readJSON(usersFile);
    users = users.filter(u => u.email !== email);
    writeJSON(usersFile, users);

    req.session.destroy();
    res.json({ success: true });
}

module.exports = { registerUser, loginUser, logoutUser, updateProfile, changePassword, deleteAccount };