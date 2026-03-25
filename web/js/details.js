// Récuperation de l'ID d'un film
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const container = document.getElementById("film-detail");

// Si pas d'ID dans l'URL → film introuvable
if (!id) {
    container.innerHTML = "<p>Film introuvable</p>";

} else {

    // Chargement des données d'un film
    // Récupère en même temps les détails et la bande annonce
    Promise.all([
        fetch(`/api/movie/${id}`).then(r => r.json()),
        fetch(`/api/movie/${id}/trailer`).then(r => r.json())
    ])
        .then(([film, trailerData]) => {
            const trailerKey = trailerData.trailerKey;

            // Affichage d'un film
            container.innerHTML = `

            <!-- Image de fond -->
            <div class="detail-backdrop" 
                ${film.poster ? `style="background-image: url('${film.poster.replace('w500','w1280')}')"` : ''}>
            </div>

            <div class="detail-content">

                <!-- Affiche du film -->
                <div class="detail-left">
                    ${film.poster ? `<img class="detail-poster" src="${film.poster}" alt="${film.titre}">` : ""}
                </div>

                <!-- Infos du film -->
                <div class="detail-right">
                    <h1 class="detail-title">${film.titre}</h1>

                    <!-- Note, année, genres -->
                    <div class="detail-meta">
                        <span>★ ${film.note ? film.note.toFixed(1) : "?"}/10</span>
                        <span>${film.date_sortie ? film.date_sortie.slice(0,4) : ""}</span>
                        <span>${film.genres?.join(" · ")}</span>
                    </div>

                    <!-- Synopsis -->
                    <p class="detail-synopsis">${film.synopsis}</p>

                    <!-- Acteurs -->
                    <div class="detail-cast">
                        <span class="detail-label">Acteurs</span>
                        <p>${film.acteurs?.join(", ")}</p>
                    </div>

                    <!-- Bande annonce YouTube (si disponible) -->
                    ${trailerKey ? `
                    <div class="detail-trailer">
                        <span class="detail-label">Bande annonce</span>
                        <div class="trailer-frame">
                            <iframe
                                src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1"
                                frameborder="0"
                                allow="autoplay; encrypted-media"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>` : ''}

                </div>
            </div>
        `;
        })
        .catch(err => {
            // En cas d'erreur → message d'erreur
            container.innerHTML = "<p>Erreur chargement film</p>";
            console.error(err);
        });
}