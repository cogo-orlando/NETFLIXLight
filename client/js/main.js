const container = document.getElementById("films-container");

fetch('/api/trending')
    .then(res => res.json())
    .then(data => {
        if (!data.films) throw new Error("Films introuvables");

        data.films.forEach(film => {
            const div = document.createElement('div');
            div.className = "film-card";
            div.innerHTML = `
                <a href="details.html?id=${film.id}">
                    <img src="${film.poster}" alt="${film.titre}">
                </a>
                <h3>${film.titre}</h3>          
            `;
            container.appendChild(div);
        });
    })
    .catch(err => {
        container.innerHTML = `<p>Erreur fetch films : ${err.message}</p>`;
        console.error(err);
    });