const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

// Inscription
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Récupère les données du formulaire
        const data = {
            pseudo:   registerForm.pseudo.value,
            email:    registerForm.email.value,
            password: registerForm.password.value,
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

            // Si l'inscription est réussie, ca sauvegarde et redirige vers la page des films
            if (result.user) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/films';
            }
        } catch (err) {
            document.getElementById('register-message').textContent = 'Sever error';
        }
    });
}

// Connexion
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

            // Connexion réussie ça sauvegarde et redirige vers la page des films
            if (result.user) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/films';
            }
        } catch (err) {
            document.getElementById('login-message').textContent = 'Server error';
        }
    });
}

// Vérification de la connexion
fetch('/auth/me')
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            // Affiche le bouton déconnexion
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.classList.remove('hidden');

            // Affiche le pseudo
            const profileLink = document.getElementById('user-profile-link');
            if (profileLink) {
                profileLink.classList.remove('hidden');
                profileLink.textContent = data.user.pseudo;
                const sepProfile = document.getElementById('sep-profile');
                if (sepProfile) sepProfile.classList.remove('hidden');
                const sepLogout = document.getElementById('sep-logout');
                if (sepLogout) sepLogout.classList.remove('hidden');
            }
        }
    });

// Déconnexion
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        fetch('/auth/logout', { method: 'POST' })
            .then(() => {
                sessionStorage.removeItem('user');
                window.location.href = '/films';
            });
    });
}