const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

// ─── SÉLECTION DE L'AVATAR ───────────────────────────────
document.querySelectorAll('.avatar-choice').forEach(el => {
    el.addEventListener('click', () => {
        // Retire la sélection de tous les avatars
        document.querySelectorAll('.avatar-choice').forEach(e => e.classList.remove('selected'));
        // Sélectionne l'avatar cliqué
        el.classList.add('selected');
        document.getElementById('avatar-input').value = el.dataset.avatar;
    });
});

// ─── INSCRIPTION ─────────────────────────────────────────
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Récupère les données du formulaire
        const data = {
            pseudo:   registerForm.pseudo.value,
            email:    registerForm.email.value,
            password: registerForm.password.value,
            avatar:   document.getElementById('avatar-input').value
        };

        try {
            // Envoie les données au serveur
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            document.getElementById('register-message').textContent = result.message || result.error;

            // Si inscription réussie → sauvegarde et redirige
            if (result.user) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/';
            }
        } catch (err) {
            document.getElementById('register-message').textContent = 'Erreur serveur';
        }
    });
}

// ─── CONNEXION ───────────────────────────────────────────
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Récupère les données du formulaire
        const data = {
            email:    loginForm.email.value,
            password: loginForm.password.value
        };

        try {
            // Envoie les données au serveur
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            document.getElementById('login-message').textContent = result.message || result.error;

            // Si connexion réussie → sauvegarde et redirige
            if (result.user) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/';
            }
        } catch (err) {
            document.getElementById('login-message').textContent = 'Erreur serveur';
        }
    });
}

// ─── VÉRIFICATION DE CONNEXION AU CHARGEMENT ─────────────
fetch('/auth/me')
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            // Affiche le bouton déconnexion
            document.getElementById('logout-btn').classList.remove('hidden');

            // Affiche l'avatar et le pseudo
            const avatar = document.getElementById('user-avatar');
            if (avatar) {
                avatar.classList.remove('hidden');
                document.getElementById('avatar-letter').textContent = data.user.avatar || "🎬";
                document.getElementById('avatar-pseudo').textContent = data.user.pseudo;
            }
        }
    });

// ─── DÉCONNEXION ─────────────────────────────────────────
document.getElementById('logout-btn').addEventListener('click', () => {
    fetch('/auth/logout', { method: 'POST' })
        .then(() => {
            window.location.href = '/'; // Redirige vers l'accueil
        });
});

// ─── COULEUR PERSONNALISÉE ───────────────────────────────
// Applique la couleur sauvegardée par l'utilisateur
const savedColor = localStorage.getItem('accentColor');
if (savedColor) {
    document.documentElement.style.setProperty('--red', savedColor);
    document.documentElement.style.setProperty('--red-light', savedColor);
}