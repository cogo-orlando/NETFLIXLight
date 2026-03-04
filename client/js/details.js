const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const container = document.getElementById("film-detail");

if (!id) {
    container.innerHTML = "<p>Film introuvable</p>";
} else {
    fetch(`/api/movie/${id}`)
        .then(res => res.json())
        .then(film => {
            container.innerHTML = `
                ${film.poster ? `<img src="${film.poster}" alt="${film.titre}" width="200">` : ""}
                <h2>${film.titre}</h2>
                <p><strong>Date de sortie :</strong> ${film.date_sortie}</p>
                <p><strong>Note :</strong> ${film.note}</p>
                <p><strong>Genres :</strong> ${film.genres?.join(", ")}</p>
                <p><strong>Acteurs :</strong> ${film.acteurs?.join(", ")}</p>
                <p><strong>Description :</strong> ${film.synopsis}</p>
            `;
        })
        .catch(err => {
            container.innerHTML = "<p>Erreur chargement film</p>";
            console.error(err);
        });
}