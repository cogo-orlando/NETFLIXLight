// ─── COULEUR PERSONNALISÉE ───────────────────────────────
const savedColor = localStorage.getItem('accentColor');
if (savedColor) {
    document.documentElement.style.setProperty('--red', savedColor);
    document.documentElement.style.setProperty('--red-light', savedColor);
}

let favorites = [];

// ─── FAVORIS ─────────────────────────────────────────────

// Charge la liste des favoris depuis le serveur
async function loadFavorites() {
    const res = await fetch("/api/favorites");
    favorites = await res.json();
}

// Ajoute un film aux favoris
async function addFavorite(film) {
    await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film)
    });
}

// Supprime un film des favoris
async function removeFavorite(id) {
    await fetch(`/api/favorites/${id}`, { method: "DELETE" });
}

// ─── CRÉATION D'UNE CARTE FILM ───────────────────────────
function createCard(film) {
    const isFavorite = favorites.some(f => f.id === film.id);
    const div = document.createElement('div');
    div.className = "film-card";

    div.innerHTML = `
        <!-- Affiche + lien vers les détails -->
        <a href="details.html?id=${film.id}">
            <img src="${film.poster}" alt="${film.titre}" loading="lazy">
            <div class="film-overlay"><span>${film.titre}</span></div>
        </a>

        <!-- Bouton favori -->
        <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${film.id}">
            ${isFavorite ? "★" : "☆"}
        </button>

        <!-- Bouton playlist -->
        <button class="playlist-btn" title="Ajouter à une playlist">☰</button>

        <!-- Infos du film -->
        <h3>${film.titre}</h3>
        <div class="film-meta">
            <span>★ ${film.note ? film.note.toFixed(1) : "?"}</span>
            <span>${film.date_sortie ? film.date_sortie.slice(0,4) : ""}</span>
        </div>

        <!-- Menu playlist (caché par défaut) -->
        <div class="playlist-menu hidden" id="pm-${film.id}"></div>
    `;

    // ─── BOUTON FAVORI ───────────────────────────────────
    const btn = div.querySelector(".favorite-btn");
    btn.addEventListener("click", async () => {
        const isActive = btn.classList.contains("active");
        if (isActive) {
            // Retire des favoris
            btn.classList.remove("active");
            btn.textContent = "☆";
            await removeFavorite(film.id);
        } else {
            // Ajoute aux favoris
            btn.classList.add("active");
            btn.textContent = "★";
            await addFavorite({ id: film.id, titre: film.titre, poster: film.poster });
        }
    });

    // ─── BOUTON PLAYLIST ─────────────────────────────────
    const plBtn = div.querySelector('.playlist-btn');
    const plMenu = div.querySelector('.playlist-menu');

    plBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');

        // Si aucune playlist → invite à en créer une
        if (playlists.length === 0) {
            plMenu.innerHTML = `<div class="pm-item"><a href="playlists.html">Créer une playlist d'abord</a></div>`;
        } else {
            // Affiche la liste des playlists
            plMenu.innerHTML = playlists.map((pl, i) => `
                <div class="pm-item" data-index="${i}">${pl.name}</div>
            `).join('');

            // Ajoute le film à la playlist cliquée
            plMenu.querySelectorAll('.pm-item').forEach(item => {
                item.addEventListener('click', () => {
                    const pls = JSON.parse(localStorage.getItem('playlists') || '[]');
                    const i = parseInt(item.dataset.index);
                    const dejaPresent = pls[i].films.some(f => f.id === film.id);
                    if (!dejaPresent) {
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

// ─── CRÉATION D'UNE SECTION DE FILMS ─────────────────────
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

    // Ajoute chaque film dans la ligne
    films.forEach(film => row.appendChild(createCard(film)));

    // Flèches pour faire défiler les films
    btnLeft.addEventListener('click', () => row.scrollBy({ left: -600, behavior: 'smooth' }));
    btnRight.addEventListener('click', () => row.scrollBy({ left: 600, behavior: 'smooth' }));

    return section;
}

// ─── BANNIÈRE PRINCIPALE ─────────────────────────────────
async function loadHeroBanner(films) {
    const heroFilms = films.slice(0, 8); // Prend les 8 premiers films
    let current = 0;
    let timer = null;

    // Éléments HTML de la bannière
    const backdrop    = document.getElementById('hero-backdrop');
    const title       = document.getElementById('hero-film-title');
    const synopsis    = document.getElementById('hero-synopsis');
    const meta        = document.getElementById('hero-meta');
    const btnPlay     = document.getElementById('hero-btn-play');
    const btnFav      = document.getElementById('hero-btn-fav');
    const dotsContainer = document.getElementById('hero-dots');
    const trailerDiv  = document.getElementById('hero-trailer');
    const btnPrev     = document.getElementById('hero-prev');
    const btnNext     = document.getElementById('hero-next');

    // Crée les points de navigation
    heroFilms.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { resetTimer(); showFilm(i); });
        dotsContainer.appendChild(dot);
    });

    // Flèches de navigation
    btnPrev.addEventListener('click', () => {
        resetTimer();
        showFilm((current - 1 + heroFilms.length) % heroFilms.length);
    });
    btnNext.addEventListener('click', () => {
        resetTimer();
        showFilm((current + 1) % heroFilms.length);
    });

    // Change de film automatiquement toutes les 15 secondes
    function resetTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => showFilm((current + 1) % heroFilms.length), 15000);
    }

    // ─── AFFICHE UN FILM DANS LA BANNIÈRE ────────────────
    async function showFilm(index) {
        current = index;
        const film = heroFilms[index];

        // Récupère les détails et la bande annonce en même temps
        const [detailRes, trailerRes] = await Promise.all([
            fetch(`/api/movie/${film.id}`),
            fetch(`/api/movie/${film.id}/trailer`)
        ]);
        const detail = await detailRes.json();
        const trailerData = await trailerRes.json();

        // Met à jour la bannière
        backdrop.style.backgroundImage = `url('${film.poster.replace('w500', 'w1280')}')`;
        title.textContent = film.titre;
        synopsis.textContent = detail.synopsis || '';
        meta.innerHTML = `
            <span>★ ${film.note ? film.note.toFixed(1) : '?'}</span>
            <span>${film.date_sortie ? film.date_sortie.slice(0,4) : ''}</span>
            <span>${detail.genres ? detail.genres.slice(0,2).join(' · ') : ''}</span>
        `;

        btnPlay.href = `details.html?id=${film.id}`;

        // Bouton favori
        btnFav.textContent = favorites.some(f => f.id === film.id) ? '✓ Dans ma liste' : '+ Ma liste';
        btnFav.onclick = async () => {
            await addFavorite({ id: film.id, titre: film.titre, poster: film.poster });
            btnFav.textContent = '✓ Dans ma liste';
        };

        // Affiche la bande annonce si disponible
        if (trailerData.trailerKey) {
            trailerDiv.innerHTML = `
                <iframe
                    src="https://www.youtube.com/embed/${trailerData.trailerKey}?autoplay=1&mute=1&loop=1"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen>
                </iframe>`;
            trailerDiv.classList.add('visible');
        } else {
            trailerDiv.innerHTML = '';
            trailerDiv.classList.remove('visible');
        }

        // Met à jour les points de navigation
        document.querySelectorAll('.hero-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    showFilm(0);
    resetTimer();
}

// ─── CHARGEMENT DE LA PAGE ───────────────────────────────
async function loadPage() {
    await loadFavorites();
    const container = document.getElementById("films-container");

    // Noms des genres en français
    const labels = {
        action: "🔥 Action",
        comedy: "😂 Comédie",
        horror: "👻 Horreur",
        scifi:  "🚀 Science-Fiction",
        drama:  "🎭 Drame"
    };

    // Charge les films tendance
    const trendingData = await fetch('/api/trending').then(r => r.json());
    if (trendingData.films) {
        await loadHeroBanner(trendingData.films);
        container.appendChild(createSection("🎬 Tendances de la semaine", trendingData.films.slice(0, 20)));
    }

    // Charge les films les mieux notés
    const topData = await fetch('/api/toprated').then(r => r.json());
    if (topData.films) {
        container.appendChild(createSection("⭐ Les mieux notés", topData.films));
    }

    // Charge les films par genre
    const genreData = await fetch('/api/genres').then(r => r.json());
    if (genreData.categories) {
        genreData.categories.forEach(cat => {
            container.appendChild(createSection(labels[cat.categorie] || cat.categorie, cat.films));
        });
    }

    // ─── BARRE DE RECHERCHE ──────────────────────────────
    document.getElementById("fav-search").addEventListener("input", function () {
        const recherche = this.value.toLowerCase();
        document.querySelectorAll(".film-card").forEach(card => {
            const titre = card.querySelector("h3").textContent.toLowerCase();
            card.style.display = titre.includes(recherche) ? "block" : "none";
        });
    });
}

// Lance le chargement de la page
loadPage();