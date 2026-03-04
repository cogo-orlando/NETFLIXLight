const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const container = document.getElementById("film-detail");

if (!id) {
    container.innerHTML = "<p>Film introuvable</p>";
} else {
    fetch(`/api/movie/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // 🔎 IMPORTANT pour debug

            container.innerHTML = `
                ${data.poster ? `<img src="${data.poster}" alt="${data.titre}" width="200">` : ""}

                <h2>${data.titre}</h2>
                <p><strong>Date de sortie :</strong> ${data.date_sortie}</p>
                <p><strong>Note :</strong> ${data.note}</p>
                <p><strong>Genres :</strong> ${data.genres?.join(", ")}</p>
                <p><strong>Acteurs :</strong> ${data.acteurs?.join(", ")}</p>
                <p><strong>Description :</strong> ${data.synopsis}</p>
            `;
        })
        .catch(error => {
            console.error("Erreur :", error);
            container.innerHTML = "<p>Erreur chargement film</p>";
        });
}