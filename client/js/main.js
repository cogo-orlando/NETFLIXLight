const container = document.getElementById("films-container");

let favorites = [];

// récupérer les favoris existants
async function loadFavorites() {

    const res = await fetch("/api/favorites");
    favorites = await res.json();

}

// ajouter un favori
async function addFavorite(movie){

    await fetch("/api/favorites",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(movie)
    });

}

// supprimer un favori
async function removeFavorite(id){

    await fetch(`/api/favorites/${id}`,{
        method:"DELETE"
    });

}

// afficher les films
async function loadMovies(){

    await loadFavorites();

    fetch('/api/trending')
        .then(res => res.json())
        .then(data => {

            if (!data.films) throw new Error("Films introuvables");

            data.films.forEach(film => {

                const div = document.createElement('div');
                div.className = "film-card";

                // vérifier si déjà favori
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

                    if(isActive){

                        btn.classList.remove("active");
                        btn.textContent = "☆";

                        await removeFavorite(film.id);

                    }else{

                        btn.classList.add("active");
                        btn.textContent = "★";

                        await addFavorite({
                            id: film.id,
                            titre: film.titre,
                            poster: film.poster
                        });

                    }

                });

                container.appendChild(div);

            });

        })
        .catch(err => {

            container.innerHTML = `<p>Erreur fetch films : ${err.message}</p>`;
            console.error(err);

        });

}

loadMovies();

document.getElementById("fav-search").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll(".fav-card").forEach(card => {
        const titre = card.querySelector(".fav-movie-title").textContent.toLowerCase();
        card.style.display = titre.includes(query) ? "block" : "none";
    });
});