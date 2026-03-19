const savedColorMain = localStorage.getItem('accentColor');
if (savedColorMain) {
    document.documentElement.style.setProperty('--red', savedColorMain);
    document.documentElement.style.setProperty('--red-light', savedColorMain);
}

let favorites = [];

async function loadFavorites() {
    const res = await fetch("/api/favorites");
    favorites = await res.json();
}

async function addFavorite(movie) {
    await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie)
    });
}

async function removeFavorite(id) {
    await fetch(`/api/favorites/${id}`, { method: "DELETE" });
}

function createCard(film) {
    const isFavorite = favorites.some(f => f.id === film.id);
    const div = document.createElement('div');
    div.className = "film-card";
    div.innerHTML = `
        <a href="details.html?id=${film.id}">
            <img src="${film.poster}" alt="${film.titre}" loading="lazy">
            <div class="film-overlay"><span>${film.titre}</span></div>
        </a>
        <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${film.id}">
            ${isFavorite ? "★" : "☆"}
        </button>
        <button class="playlist-btn" title="Ajouter à une playlist">☰</button>
        <h3>${film.titre}</h3>
        <div class="film-meta">
            <span class="film-note">★ ${film.note ? film.note.toFixed(1) : "?"}</span>
            <span class="film-year">${film.date_sortie ? film.date_sortie.slice(0,4) : ""}</span>
        </div>
        <div class="playlist-menu hidden" id="pm-${film.id}"></div>
    `;

    const btn = div.querySelector(".favorite-btn");
    btn.addEventListener("click", async () => {
        const isActive = btn.classList.contains("active");
        if (isActive) {
            btn.classList.remove("active");
            btn.textContent = "☆";
            await removeFavorite(film.id);
        } else {
            btn.classList.add("active");
            btn.textContent = "★";
            await addFavorite({ id: film.id, titre: film.titre, poster: film.poster });
        }
    });

    const plBtn = div.querySelector('.playlist-btn');
    const plMenu = div.querySelector('.playlist-menu');

    plBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');

        if (playlists.length === 0) {
            plMenu.innerHTML = `<div class="pm-item"><a href="playlists.html">Créer une playlist d'abord</a></div>`;
        } else {
            plMenu.innerHTML = playlists.map((pl, i) => `
                <div class="pm-item" data-index="${i}">${pl.name}</div>
            `).join('');

            plMenu.querySelectorAll('.pm-item').forEach(item => {
                item.addEventListener('click', () => {
                    const pls = JSON.parse(localStorage.getItem('playlists') || '[]');
                    const i = parseInt(item.dataset.index);
                    const already = pls[i].films.some(f => f.id === film.id);
                    if (!already) {
                        pls[i].films.push({ id: film.id, titre: film.titre, poster: film.poster });
                        localStorage.setItem('playlists', JSON.stringify(pls));
                        item.textContent = '✓ ' + pls[i].name;
                    } else {
                        item.textContent = '✓ Déjà dans la liste';
                    }
                });
            });
        }

        plMenu.classList.toggle('hidden');
    });

    return div;
}

function createSection(titre, films) {
    const section = document.createElement('div');
    section.className = "film-section";
    section.innerHTML = `
        <h2 class="section-title">${titre}</h2>
        <div class="film-row-wrapper">
            <button class="row-arrow row-arrow-left">&#8592;</button>
            <div class="film-row"></div>
            <button class="row-arrow row-arrow-right">&#8594;</button>
        </div>
    `;
    const row = section.querySelector('.film-row');
    const btnLeft = section.querySelector('.row-arrow-left');
    const btnRight = section.querySelector('.row-arrow-right');

    films.forEach(film => row.appendChild(createCard(film)));

    btnLeft.addEventListener('click', () => {
        row.scrollBy({ left: -600, behavior: 'smooth' });
    });

    btnRight.addEventListener('click', () => {
        row.scrollBy({ left: 600, behavior: 'smooth' });
    });

    return section;
}

async function loadHeroBanner(films) {
    const heroFilms = films.slice(0, 8);
    let current = 0;
    let timer = null;

    const backdrop = document.getElementById('hero-backdrop');
    const title = document.getElementById('hero-film-title');
    const synopsis = document.getElementById('hero-synopsis');
    const meta = document.getElementById('hero-meta');
    const btnPlay = document.getElementById('hero-btn-play');
    const btnFav = document.getElementById('hero-btn-fav');
    const dotsContainer = document.getElementById('hero-dots');
    const trailerDiv = document.getElementById('hero-trailer');
    const btnPrev = document.getElementById('hero-prev');
    const btnNext = document.getElementById('hero-next');

    heroFilms.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { resetTimer(); showFilm(i); });
        dotsContainer.appendChild(dot);
    });

    btnPrev.addEventListener('click', () => {
        resetTimer();
        showFilm((current - 1 + heroFilms.length) % heroFilms.length);
    });

    btnNext.addEventListener('click', () => {
        resetTimer();
        showFilm((current + 1) % heroFilms.length);
    });

    function resetTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => showFilm((current + 1) % heroFilms.length), 15000);
    }

    async function showFilm(index) {
        current = index;
        const film = heroFilms[index];

        const [detailRes, trailerRes] = await Promise.all([
            fetch(`/api/movie/${film.id}`),
            fetch(`/api/movie/${film.id}/trailer`)
        ]);
        const detail = await detailRes.json();
        const trailerData = await trailerRes.json();

        backdrop.style.backgroundImage = `url('${film.poster.replace('w500', 'w1280')}')`;
        title.textContent = film.titre;
        synopsis.textContent = detail.synopsis || '';
        meta.innerHTML = `
            <span class="hero-note">★ ${film.note ? film.note.toFixed(1) : '?'}</span>
            <span>${film.date_sortie ? film.date_sortie.slice(0,4) : ''}</span>
            <span>${detail.genres ? detail.genres.slice(0,2).join(' · ') : ''}</span>
        `;
        btnPlay.href = `details.html?id=${film.id}`;

        btnFav.textContent = favorites.some(f => f.id === film.id) ? '✓ Dans ma liste' : '+ Ma liste';
        btnFav.onclick = async () => {
            await addFavorite({ id: film.id, titre: film.titre, poster: film.poster });
            btnFav.textContent = '✓ Dans ma liste';
        };

        if (trailerData.trailerKey) {
            trailerDiv.innerHTML = `
                <iframe
                    src="https://www.youtube.com/embed/${trailerData.trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerData.trailerKey}&controls=0&modestbranding=1"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen>
                </iframe>`;
            trailerDiv.classList.add('visible');
        } else {
            trailerDiv.innerHTML = '';
            trailerDiv.classList.remove('visible');
        }

        document.querySelectorAll('.hero-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    showFilm(0);
    resetTimer();
}

async function loadPage() {
    await loadFavorites();
    const container = document.getElementById("films-container");

    const labels = {
        action: "🔥 Action",
        comedy: "😂 Comédie",
        horror: "👻 Horreur",
        scifi: "🚀 Science-Fiction",
        drama: "🎭 Drame"
    };

    const trendingRes = await fetch('/api/trending');
    const trendingData = await trendingRes.json();
    if (trendingData.films) {
        await loadHeroBanner(trendingData.films);
        container.appendChild(createSection("🎬 Tendances de la semaine", trendingData.films.slice(0, 20)));
    }

    const topRes = await fetch('/api/toprated');
    const topData = await topRes.json();
    if (topData.films) {
        container.appendChild(createSection("⭐ Les mieux notés", topData.films));
    }

    const genreRes = await fetch('/api/genres');
    const genreData = await genreRes.json();
    if (genreData.categories) {
        genreData.categories.forEach(cat => {
            container.appendChild(createSection(labels[cat.categorie] || cat.categorie, cat.films));
        });
    }

    document.getElementById("fav-search").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        document.querySelectorAll(".film-card").forEach(card => {
            const titre = card.querySelector("h3").textContent.toLowerCase();
            card.style.display = titre.includes(query) ? "block" : "none";
        });
    });
}

loadPage();