const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, updateProfile, changePassword, deleteAccount } = require('../logic/authentification.js');

// ─── ROUTES AUTHENTIFICATION ─────────────────────────────

router.post('/register', registerUser);      // Inscription
router.post('/login', loginUser);            // Connexion
router.post('/logout', logoutUser);          // Déconnexion
router.put('/profile', updateProfile);       // Modifier le profil
router.put('/password', changePassword);     // Changer le mot de passe
router.delete('/delete', deleteAccount);     // Supprimer le compte

// Vérifie si l'utilisateur est connecté
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user }); // Retourne l'utilisateur
    } else {
        res.json({ user: null }); // Personne de connecté
    }
});

module.exports = router;