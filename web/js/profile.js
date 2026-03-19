// ─── CHARGEMENT DU PROFIL ────────────────────────────────
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
    document.getElementById('profile-avatar').textContent = user.avatar || '🎬';
    document.getElementById('profile-pseudo').textContent = user.pseudo;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-date').textContent = user.dateInscription
        ? new Date(user.dateInscription).toLocaleDateString('fr-FR')
        : 'Inconnue';

    // Affiche le nombre de favoris
    const favRes = await fetch('/api/favorites');
    const favs = await favRes.json();
    document.getElementById('stat-favoris').textContent = favs.length;

    // Met en évidence l'avatar actuel de l'utilisateur
    document.querySelectorAll('.avatar-choice').forEach(el => {
        if (el.dataset.avatar === user.avatar) el.classList.add('selected');
        el.addEventListener('click', () => {
            document.querySelectorAll('.avatar-choice').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
        });
    });
}

// ─── MODIFIER LE PROFIL ──────────────────────────────────
document.getElementById('save-profile-btn').addEventListener('click', async () => {
    const pseudo = document.getElementById('input-pseudo').value.trim();
    const avatar = document.querySelector('.avatar-choice.selected')?.dataset.avatar;

    // Envoie seulement les champs modifiés
    const body = {};
    if (pseudo) body.pseudo = pseudo;
    if (avatar) body.avatar = avatar;

    const res = await fetch('/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const result = await res.json();
    document.getElementById('profile-message').textContent = result.message || result.error;

    // Met à jour l'affichage si succès
    if (result.user) {
        document.getElementById('profile-pseudo').textContent = result.user.pseudo;
        document.getElementById('profile-avatar').textContent = result.user.avatar;
    }
});

// ─── CHANGER LE MOT DE PASSE ─────────────────────────────
document.getElementById('save-password-btn').addEventListener('click', async () => {
    const oldPassword = document.getElementById('input-old-password').value;
    const newPassword = document.getElementById('input-new-password').value;

    const res = await fetch('/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
    });

    const result = await res.json();
    document.getElementById('password-message').textContent = result.message || result.error;
});

// ─── COULEUR DU SITE ─────────────────────────────────────

// Applique la couleur sauvegardée au chargement
const savedColor = localStorage.getItem('accentColor');
if (savedColor) applyColor(savedColor);

// Met en évidence la couleur actuellement sélectionnée
document.querySelectorAll('.color-choice').forEach(el => {
    if (el.dataset.color === savedColor) el.classList.add('selected');
    el.addEventListener('click', () => {
        document.querySelectorAll('.color-choice').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
    });
});

// Sauvegarde et applique la nouvelle couleur
document.getElementById('save-color-btn').addEventListener('click', () => {
    const selected = document.querySelector('.color-choice.selected');
    if (!selected) return;
    const color = selected.dataset.color;

    localStorage.setItem('accentColor', color);
    applyColor(color);
    document.getElementById('color-message').textContent = 'Couleur appliquée ✓';
});

// Applique une couleur sur tout le site
function applyColor(color) {
    document.documentElement.style.setProperty('--red', color);
    document.documentElement.style.setProperty('--red-light', color);
}

// ─── SUPPRIMER LE COMPTE ─────────────────────────────────
document.getElementById('delete-account-btn').addEventListener('click', async () => {

    // Demande confirmation avant de supprimer
    const confirme = window.confirm('Es-tu sûr ? Cette action est irréversible.');
    if (!confirme) return;

    const res = await fetch('/auth/delete', { method: 'DELETE' });
    const result = await res.json();

    if (result.success) {
        window.location.href = 'signup.html'; // Redirige vers l'inscription
    } else {
        document.getElementById('delete-message').textContent = result.error;
    }
});

// Lance le chargement du profil
loadProfile();