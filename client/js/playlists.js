const savedColorPl = localStorage.getItem('accentColor');
if (savedColorPl) {
    document.documentElement.style.setProperty('--red', savedColorPl);
    document.documentElement.style.setProperty('--red-light', savedColorPl);
}

// Storage playlists dans localStorage
function getPlaylists() {
    return JSON.parse(localStorage.getItem('playlists') || '[]');
}

function savePlaylists(playlists) {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

const container = document.getElementById('playlists-container');
const detail = document.getElementById('pl-detail');
const modal = document.getElementById('pl-modal');

// Afficher toutes les playlists
function renderPlaylists() {
    const playlists = getPlaylists();
    container.innerHTML = '';
    detail.classList.add('hidden');
    container.classList.remove('hidden');

    if (playlists.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:4rem; color:#555; font-size:0.8rem; letter-spacing:3px; text-transform:uppercase;">
                Aucune playlist créée.
            </div>`;
        return;
    }

    playlists.forEach((pl, index) => {
        const card = document.createElement('div');
        card.classList.add('pl-card');

        const preview = pl.films.slice(0, 4);
        const previewHtml = preview.length > 0
            ? `<div class="pl-card-preview">${preview.map(f => `<img src="${f.poster}" alt="${f.titre}">`).join('')}</div>`
            : `<div class="pl-card-preview-empty">🎬</div>`;

        card.innerHTML = `
            ${previewHtml}
            <div class="pl-card-info">
                <p class="pl-card-name">${pl.name}</p>
                <p class="pl-card-count">${pl.films.length} film${pl.films.length !== 1 ? 's' : ''}</p>
            </div>`;

        card.addEventListener('click', () => openPlaylist(index));
        container.appendChild(card);
    });
}

// Ouvrir une playlist
function openPlaylist(index) {
    const playlists = getPlaylists();
    const pl = playlists[index];

    container.classList.add('hidden');
    detail.classList.remove('hidden');

    document.getElementById('pl-detail-title').textContent = pl.name;
    document.getElementById('pl-empty-detail').classList.toggle('hidden', pl.films.length > 0);

    const filmsContainer = document.getElementById('pl-detail-films');
    filmsContainer.className = 'pl-films-grid';
    filmsContainer.innerHTML = '';

    pl.films.forEach(film => {
        const card = document.createElement('div');
        card.classList.add('pl-film-card');
        card.innerHTML = `
            <img src="${film.poster}" alt="${film.titre}">
            <div class="pl-film-overlay">
                <p class="pl-film-title">${film.titre}</p>
                <div class="pl-film-btns">
                    <a class="pl-film-detail" href="details.html?id=${film.id}">Détails</a>
                    <button class="pl-film-remove" data-id="${film.id}">✕ Retirer</button>
                </div>
            </div>`;

        card.querySelector('.pl-film-remove').addEventListener('click', () => {
            removeFromPlaylist(index, film.id);
            openPlaylist(index);
        });

        filmsContainer.appendChild(card);
    });

    document.getElementById('pl-delete-pl').onclick = () => {
        if (confirm(`Supprimer la playlist "${pl.name}" ?`)) {
            const playlists = getPlaylists();
            playlists.splice(index, 1);
            savePlaylists(playlists);
            renderPlaylists();
        }
    };
}

    // Supprimer la playlist
    document.getElementById('pl-delete-pl').onclick = () => {
        if (confirm(`Supprimer la playlist "${pl.name}" ?`)) {
            const playlists = getPlaylists();
            playlists.splice(index, 1);
            savePlaylists(playlists);
            renderPlaylists();
        }
}

function removeFromPlaylist(plIndex, filmId) {
    const playlists = getPlaylists();
    playlists[plIndex].films = playlists[plIndex].films.filter(f => f.id !== filmId);
    savePlaylists(playlists);
}

// Retour
document.getElementById('pl-back').addEventListener('click', renderPlaylists);

// Créer une playlist
document.getElementById('pl-create-btn').addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.getElementById('pl-name-input').value = '';
    document.getElementById('pl-name-input').focus();
});

document.getElementById('pl-cancel').addEventListener('click', () => {
    modal.classList.add('hidden');
});

document.getElementById('pl-confirm').addEventListener('click', () => {
    const name = document.getElementById('pl-name-input').value.trim();
    if (!name) return;

    const playlists = getPlaylists();
    playlists.push({ name, films: [] });
    savePlaylists(playlists);
    modal.classList.add('hidden');
    renderPlaylists();
});

renderPlaylists();