// client/js/auth.js
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            pseudo: registerForm.pseudo.value,
            email: registerForm.email.value,
            password: registerForm.password.value
        };

        try {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            document.getElementById('register-message').textContent = result.message || result.error;
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
            if (result.user) {
                window.location.href = '/';
            }
        } catch (err) {
            console.error(err);
            document.getElementById('login-message').textContent = 'Erreur serveur';
        }
    });
}