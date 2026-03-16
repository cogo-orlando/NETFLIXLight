const container = document.getElementById("films-container");

let favorites = [];

async function loadFavorites() {
    const res = await fetch("/api/favorites");
    favorites = await res.json();
}

async function addFavorite(movie) {
    await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie)
    });
}

async function removeFavorite(id) {
    await fetch(`/api/favorites/${id}`, { method: "DELETE" });
}

async function loadMovies() {
    await loadFavorites();

    fetch('/api/trending')
        .then(res => res.json())
        .then(data => {
            if (!data.films) throw new Error("Films introuvables");

            data.films.forEach(film => {
                const div = document.createElement('div');
                div.className = "film-card";

                const isFavorite = favorites.some(f => f.id === film.id);

                div.innerHTML = `
                    <a href="details.html?id=${film.id}">
                        <img src="${film.poster}" alt="${film.titre}">
                    </a>
                    <h3>${film.titre}</h3>
                    <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${film.id}">
                        ${isFavorite ? "★" : "☆"}
                    </button>
                `;

                const btn = div.querySelector(".favorite-btn");

                btn.addEventListener("click", async () => {
                    const isActive = btn.classList.contains("active");
                    if (isActive) {
                        btn.classList.remove("active");
                        btn.textContent = "☆";
                        await removeFavorite(film.id);
                    } else {
                        btn.classList.add("active");
                        btn.textContent = "★";
                        await addFavorite({ id: film.id, titre: film.titre, poster: film.poster });
                    }
                });

                container.appendChild(div);
            });

            // Barre de recherche branchée après le chargement des films
            document.getElementById("fav-search").addEventListener("input", function () {
                const query = this.value.toLowerCase();
                document.querySelectorAll(".film-card").forEach(card => {
                    const titre = card.querySelector("h3").textContent.toLowerCase();
                    card.style.display = titre.includes(query) ? "block" : "none";
                });
            });

        })
        .catch(err => {
            container.innerHTML = `<p>Erreur fetch films : ${err.message}</p>`;
            console.error(err);
        });
}

loadMovies();