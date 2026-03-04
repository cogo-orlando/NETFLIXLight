// Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        };
        fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    document.getElementById("login-message").textContent = res.error;
                } else {
                    document.getElementById("login-message").textContent = res.message;
                    setTimeout(() => location.href = "index.html", 1000);
                }
            });
    });
}

// Register
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", e => {
        e.preventDefault();
        const data = {
            pseudo: e.target.pseudo.value,
            email: e.target.email.value,
            password: e.target.password.value
        };
        fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    document.getElementById("register-message").textContent = res.error;
                } else {
                    document.getElementById("register-message").textContent = res.message;
                    setTimeout(() => location.href = "index.html", 1000);
                }
            });
    });
}