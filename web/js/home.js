const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Création de particules
const particules = [];
const NOMBRE = 80;

for (let i = 0; i < NOMBRE; i++) {
    particules.push({
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        rayon:  Math.random() * 2.5 + 0.5,
        vitesse: Math.random() * 0.8 + 0.2,
        opacite: Math.random() * 0.6 + 0.1,
        drift:  (Math.random() - 0.5) * 0.4 // dérive horizontale
    });
}

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particules.forEach(p => {
        // Dessine la particule
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.rayon, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 9, 20, ${p.opacite})`;
        ctx.fill();

        // Fait tomber la particule
        p.y += p.vitesse;
        p.x += p.drift;

        // Remet en haut si elle sort par le bas
        if (p.y > canvas.height) {
            p.y = -5;
            p.x = Math.random() * canvas.width;
        }

        // Remet dans l'écran si elle sort sur les côtés
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
    });

    requestAnimationFrame(animate);
}

animate();