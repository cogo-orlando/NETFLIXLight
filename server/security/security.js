// Vérification de la connexion
function ensureAuth(req, res, next) {

    // Si l'utilisateur est connecté
    if (req.session.user) {
        next();
    }
    // En cas on refuse l'accès
    else {
        res.status(401).json({ error: "Non autorisé" });
    }
}

module.exports = { ensureAuth };