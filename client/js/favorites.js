const container = document.getElementById("favorites-container");
const empty = document.getElementById("fav-empty");

function loadFavorites() {
    container.innerHTML = "";

    fetch("/api/favorites")
        .then(res => res.json())
        .then(films => {
            if (films.length === 0) {
                empty.classList.remove("hidden");
                return;
            }

            empty.classList.add("hidden");

            films.forEach(film => {
                const card = document.createElement("div");
                card.classList.add("fav-card");
                card.dataset.id = film.id;
                card.innerHTML = `
                    <img class="fav-poster" src="${film.poster}" alt="${film.titre}">
                    <div class="fav-overlay">
                        <p class="fav-movie-title">${film.titre}</p>
                        <button class="fav-remove">✕ Retirer</button>
                    </div>`;

                card.querySelector(".fav-remove").addEventListener("click", () => {
                    removeFavorite(film.id);
                });

                container.appendChild(card);
            });
        })
        .catch(err => console.error("Erreur chargement favoris :", err));
}

function removeFavorite(id) {
    fetch(`/api/favorites/${id}`, { method: "DELETE" })
        .then(res => {
            if (res.ok) {
                loadFavorites();
            } else {
                console.error("Erreur suppression");
            }
        })
        .catch(err => console.error("Erreur suppression :", err));
}

loadFavorites();