const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

// Sélection avatar
document.querySelectorAll('.avatar-choice').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.avatar-choice').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('avatar-input').value = el.dataset.avatar;
    });
});

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            pseudo: registerForm.pseudo.value,
            email: registerForm.email.value,
            password: registerForm.password.value,
            avatar: document.getElementById('avatar-input').value
        };

        try {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            document.getElementById('register-message').textContent = result.message || result.error;

            // ← AJOUT : sauvegarde et redirection si succès
            if (result.user) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/';
            }
        } catch (err) {
            console.error(err);
            document.getElementById('register-message').textContent = 'Erreur serveur';
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            email: loginForm.email.value,
            password: loginForm.password.value
        };

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            document.getElementById('login-message').textContent = result.message || result.error;

            // ← AJOUT : sauvegarde avant redirection
            if (result.user) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/';
            }
        } catch (err) {
            console.error(err);
            document.getElementById('login-message').textContent = 'Erreur serveur';
        }
    });
}

// Vérifie si l'utilisateur est connecté au chargement
fetch('/auth/me')
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            document.getElementById('logout-btn').classList.remove('hidden');

            // Affiche l'avatar avec le pseudo
            const avatar = document.getElementById('user-avatar');
            if (avatar) {
                avatar.classList.remove('hidden');
                document.getElementById('avatar-letter').textContent = data.user.avatar || "🎬";
                document.getElementById('avatar-pseudo').textContent = data.user.pseudo;
            }
        }
    });

// Bouton déconnexion
document.getElementById('logout-btn').addEventListener('click', () => {
    fetch('/auth/logout', { method: 'POST' })
        .then(() => {
            window.location.href = '/';
        });
});

const savedColor = localStorage.getItem('accentColor');
if (savedColor) {
    document.documentElement.style.setProperty('--red', savedColor);
    document.documentElement.style.setProperty('--red-light', savedColor);
}

