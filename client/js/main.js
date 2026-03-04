// main.js
const container = document.getElementById('films-container');

fetch('/api/trending')
    .then(res => res.json())
    .then(data => {
        data.films.forEach(film => {
            const div = document.createElement('div');
            div.classList.add('film-btn'); // ajoute la classe pour le style
            div.innerHTML = `
                <a href="details.html?id=${film.id}">
                    <img src="${film.poster}" alt="${film.titre}">
                </a>
                <h3>${film.titre}</h3>
                <p>Note: ${film.note}</p>
                <p>Sortie: ${film.date_sortie}</p>
            `;
            container.appendChild(div);
        });
    })
    .catch(err => console.error("Erreur fetch films :", err));

data.films.forEach(film => {
    const div = document.createElement('div');
    div.innerHTML = `
      <a href="details.html?id=${film.id}">
          <img src="${film.poster}" width="150" alt="${film.titre}">
      </a>
      <h3>${film.titre}</h3>
      <p>Note: ${film.note}</p>
      <p>Sortie: ${film.date_sortie}</p>
  `;
    container.appendChild(div);
});

