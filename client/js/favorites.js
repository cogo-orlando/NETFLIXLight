const savedColorFav = localStorage.getItem('accentColor');
if (savedColorFav) {
    document.documentElement.style.setProperty('--red', savedColorFav);
    document.documentElement.style.setProperty('--red-light', savedColorFav);
}

const container = document.getElementById("favorites-container");
const empty = document.getElementById("fav-empty");

function loadFavorites() {
    container.innerHTML = "";

    fetch("/api/favorites")
        .then(res => res.json())
        .then(films => {
            document.getElementById('fav-count').textContent =
                films.length === 0 ? "Aucun film" :
                    films.length === 1 ? "1 film" : `${films.length} films`;

            if (films.length === 0) {
                empty.classList.remove("hidden");
                return;
            }

            empty.classList.add("hidden");

            films.forEach((film, index) => {
                const card = document.createElement("div");
                card.classList.add("fav-card");
                card.dataset.id = film.id;
                card.innerHTML = `
                    <img class="fav-poster" src="${film.poster}" alt="${film.titre}">
                    <div class="fav-number">${index + 1}</div>
                    <div class="fav-overlay">
                        <p class="fav-movie-title">${film.titre}</p>
                        <div class="fav-overlay-btns">
                            <a class="fav-detail-btn" href="details.html?id=${film.id}">Détails</a>
                            <button class="fav-remove">✕ Retirer</button>
                        </div>
                    </div>`;

                card.querySelector(".fav-remove").addEventListener("click", () => {
                    removeFavorite(film.id);
                });

                container.appendChild(card);
            });

            // Recherche
            document.getElementById("fav-search").addEventListener("input", function () {
                const query = this.value.toLowerCase();
                document.querySelectorAll(".fav-card").forEach(card => {
                    const titre = card.querySelector(".fav-movie-title").textContent.toLowerCase();
                    card.style.display = titre.includes(query) ? "block" : "none";
                });
            });
        })
        .catch(err => console.error("Erreur chargement favoris :", err));
}

function removeFavorite(id) {
    fetch(`/api/favorites/${id}`, { method: "DELETE" })
        .then(res => {
            if (res.ok) loadFavorites();
            else console.error("Erreur suppression");
        })
        .catch(err => console.error("Erreur suppression :", err));
}

loadFavorites();