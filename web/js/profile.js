// Profil
async function loadProfile() {
    const res = await fetch('/auth/me');
    const data = await res.json();

    // Si pas connecté → redirige vers la connexion
    if (!data.user) {
        window.location.href = 'login.html';
        return;
    }

    const user = data.user;

    // Affiche les infos de l'utilisateur
    document.getElementById('profile-pseudo').textContent = user.pseudo;
    document.getElementById('profile-email').textContent = user.email;

    // Affiche le nombre de favoris
    const favRes = await fetch('/api/favorites');
    const favs = await favRes.json();
    document.getElementById('stat-favoris').textContent = favs.length;
}

// Lance le chargement du profil
loadProfile();