const container = document.getElementById("favorites-container");

async function loadFavorites(){

    const res = await fetch("/api/favorites");
    const data = await res.json();

    data.forEach(film => {

        const div = document.createElement("div");

        div.innerHTML = `
            <img src="${film.poster}" width="150">
            <h3>${film.titre}</h3>
        `;

        container.appendChild(div);

    });

}

loadFavorites();