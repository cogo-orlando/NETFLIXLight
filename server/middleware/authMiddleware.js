function ensureAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: "Non autorisé" });
    }
}

module.exports = { ensureAuth };