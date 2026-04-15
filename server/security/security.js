// Vérification de la connexion
function ensureAuth(req, res, next) {

    // Si l'utilisateur est connecté
    if (req.session.user) {
        next();
    }
    // Si non on refuse l'accès
    else {
        res.status(401).json({ error: "Not allowed" });
    }
}

module.exports = { ensureAuth };