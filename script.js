// Starfield animation with shooting stars
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [], shootingStars = [];
function resizeStarfield() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function createStars() {
    stars = [];
    for (let i = 0; i < 180; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2 + 0.3,
            d: Math.random() * 0.5 + 0.2,
            o: Math.random() * 0.5 + 0.5
        });
    }
}
function createShootingStar() {
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: Math.random() * 80 + 80,
        speed: Math.random() * 8 + 6,
        size: Math.random() * 1.2 + 0.8,
        alpha: 1
    });
}
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
        ctx.save();
        ctx.globalAlpha = s.o;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#7ecbff';
        ctx.shadowColor = '#a259ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
        // Twinkle
        s.o += (Math.random() - 0.5) * 0.04;
        if (s.o < 0.3) s.o = 0.3;
        if (s.o > 1) s.o = 1;
    }
    // Shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = s.size;
        ctx.shadowColor = '#7ecbff';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y + s.len * 0.3);
        ctx.stroke();
        ctx.restore();
        s.x += s.speed;
        s.y += s.speed * 0.3;
        s.alpha -= 0.012;
        if (s.alpha <= 0) shootingStars.splice(i, 1);
    }
}
function animateStarfield() {
    for (const s of stars) {
        s.y += s.d;
        if (s.y > canvas.height) {
            s.y = 0;
            s.x = Math.random() * canvas.width;
        }
    }
    if (Math.random() < 0.012) createShootingStar();
    drawStars();
    requestAnimationFrame(animateStarfield);
}
window.addEventListener('resize', () => {
    resizeStarfield();
    createStars();
});
window.addEventListener('DOMContentLoaded', () => {
    resizeStarfield();
    createStars();
    animateStarfield();
    // Hero text animation on load
    document.querySelectorAll('.hero h1, .hero h2, .hero p, .hero .btn').forEach(el => {
        el.style.animationPlayState = 'running';
    });
    // 3D planet
    create3DPlanet();
});
// Fade-in sections on scroll
function revealSections() {
    document.querySelectorAll('main .space-section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('DOMContentLoaded', revealSections);
// Smooth scroll for nav links (fallback for browsers not supporting CSS smooth scroll)
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 10,
                    behavior: 'smooth'
                });
            }
        }
    });
});
// Parallax for nebula layers
window.addEventListener('mousemove', e => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.querySelector('.nebula1').style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    document.querySelector('.nebula2').style.transform = `translate(${-x * 40}px, ${-y * 40}px)`;
});
// 3D pop for cards/buttons
function add3DPop(selector) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 24;
            const rotateX = ((y / rect.height) - 0.5) * -24;
            el.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.08)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}
window.addEventListener('DOMContentLoaded', () => {
    add3DPop('.card');
    add3DPop('.btn.space-btn');
    add3DPop('.btn.btn-outline.space-btn');
});
// Comet cursor
const cometCursor = document.createElement('div');
cometCursor.id = 'comet-cursor';
document.body.appendChild(cometCursor);
let cometTrailTimeouts = [];
window.addEventListener('mousemove', e => {
    cometCursor.style.left = (e.clientX - 18) + 'px';
    cometCursor.style.top = (e.clientY - 18) + 'px';
    // Trailing effect
    const trail = document.createElement('div');
    trail.className = 'comet-trail';
    trail.style.left = (e.clientX - 9) + 'px';
    trail.style.top = (e.clientY - 9) + 'px';
    document.body.appendChild(trail);
    cometTrailTimeouts.push(setTimeout(() => trail.remove(), 700));
    if (cometTrailTimeouts.length > 20) {
        clearTimeout(cometTrailTimeouts.shift());
    }
});
// Constellation drawing mode
let constellationMode = false;
let constellationPoints = [];
const constellationBtn = document.getElementById('constellation-toggle');
constellationBtn.addEventListener('click', () => {
    constellationMode = !constellationMode;
    constellationBtn.classList.toggle('active', constellationMode);
    constellationBtn.innerHTML = constellationMode ? '<i class="fas fa-pen"></i> Drawing: ON' : '<i class="fas fa-star"></i> Constellation Mode';
    if (!constellationMode) {
        // Remove all lines
        document.querySelectorAll('.constellation-svg').forEach(svg => svg.remove());
        constellationPoints = [];
    }
});
window.addEventListener('mousedown', e => {
    if (!constellationMode) return;
    // Only allow drawing on background
    if (e.target.closest('main, header, .btn, .card, form, input, textarea')) return;
    constellationPoints.push({ x: e.clientX, y: e.clientY });
    if (constellationPoints.length > 1) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('constellation-svg');
        svg.style.position = 'fixed';
        svg.style.left = '0';
        svg.style.top = '0';
        svg.style.width = '100vw';
        svg.style.height = '100vh';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '10000';
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', constellationPoints[constellationPoints.length-2].x);
        line.setAttribute('y1', constellationPoints[constellationPoints.length-2].y);
        line.setAttribute('x2', constellationPoints[constellationPoints.length-1].x);
        line.setAttribute('y2', constellationPoints[constellationPoints.length-1].y);
        line.setAttribute('class', 'constellation-line');
        svg.appendChild(line);
        document.body.appendChild(svg);
    }
});
// Toast notification
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
}
// Contact form toast
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Thank you for reaching out, Abhinav will get back to you soon!');
    this.reset();
});
// Three.js 3D planet
function create3DPlanet() {
    const canvas = document.getElementById('planet3d');
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(220, 220);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 3.2;
    // Planet
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/9/97/The_Planet_Mars.png');
    const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 40 });
    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);
    // Lights
    const ambient = new THREE.AmbientLight(0x8888ff, 0.7);
    scene.add(ambient);
    const point = new THREE.PointLight(0xffffff, 1.2);
    point.position.set(5, 5, 5);
    scene.add(point);
    // Animate
    function animate() {
        planet.rotation.y += 0.008;
        planet.rotation.x += 0.001;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}
// Floating astronaut follows mouse
const astronaut = document.getElementById('astronaut');
window.addEventListener('mousemove', e => {
    if (!astronaut) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    astronaut.style.transform = `translateY(-9px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
});
// Space music toggle
const musicBtn = document.getElementById('music-toggle');
const audio = document.getElementById('space-audio');
let musicOn = false;
musicBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) {
        audio.play();
        musicBtn.classList.add('active');
        musicBtn.innerHTML = '<i class="fas fa-volume-up"></i> Space Music';
    } else {
        audio.pause();
        musicBtn.classList.remove('active');
        musicBtn.innerHTML = '<i class="fas fa-music"></i> Space Music';
    }
}); 