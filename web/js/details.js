const savedColorDetail = localStorage.getItem('accentColor');
if (savedColorDetail) {
    document.documentElement.style.setProperty('--red', savedColorDetail);
    document.documentElement.style.setProperty('--red-light', savedColorDetail);
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const container = document.getElementById("film-detail");

if (!id) {
    container.innerHTML = "<p>Film introuvable</p>";
} else {
    Promise.all([
        fetch(`/api/movie/${id}`).then(r => r.json()),
        fetch(`/api/movie/${id}/trailer`).then(r => r.json())
    ])
        .then(([film, trailerData]) => {
            const trailerKey = trailerData.trailerKey;

            container.innerHTML = `
            <div class="detail-backdrop" ${film.poster ? `style="background-image: url('https://image.tmdb.org/t/p/w1280${film.poster.replace('w500','w1280')}')"` : ''}></div>

            <div class="detail-content">

                <div class="detail-left">
                    ${film.poster ? `<img class="detail-poster" src="${film.poster}" alt="${film.titre}">` : ""}
                </div>

                <div class="detail-right">
                    <h1 class="detail-title">${film.titre}</h1>

                    <div class="detail-meta">
                        <span class="detail-note">★ ${film.note ? film.note.toFixed(1) : "?"}/10</span>
                        <span>${film.date_sortie ? film.date_sortie.slice(0,4) : ""}</span>
                        <span>${film.genres?.join(" · ")}</span>
                    </div>

                    <p class="detail-synopsis">${film.synopsis}</p>

                    <div class="detail-cast">
                        <span class="detail-label">Acteurs</span>
                        <p>${film.acteurs?.join(", ")}</p>
                    </div>

                    ${trailerKey ? `
                    <div class="detail-trailer">
                        <span class="detail-label">Bande annonce</span>
                        <div class="trailer-frame">
                            <iframe
                                src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1"
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
            container.innerHTML = "<p>Erreur chargement film</p>";
            console.error(err);
        });
}