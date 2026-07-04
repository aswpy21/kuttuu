let isUnlocked = false;

// 1. BACKGROUND TRACKING SPARKLE CANVAS ENGINE
const trailCanvas = document.getElementById('trail-canvas');
const trailCtx = trailCanvas.getContext('2d');
let particlesArray = [];
const colors = ['rgba(255, 117, 140, ', 'rgba(255, 126, 179, ', 'rgba(150, 230, 161, ', 'rgba(212, 252, 121, '];

function resizeTrailCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeTrailCanvas);
resizeTrailCanvas();

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * -2 - 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        if (this.size > 0.1) this.size -= 0.05;
    }
    draw() {
        trailCtx.save();
        trailCtx.globalAlpha = this.alpha;
        trailCtx.beginPath();
        trailCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        trailCtx.fillStyle = this.color + this.alpha + ')';
        trailCtx.shadowBlur = 8;
        trailCtx.shadowColor = this.color + '1)';
        trailCtx.fill();
        trailCtx.restore();
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].alpha <= 0) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function animateParticles() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    if (isUnlocked) handleParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

function spawnTrailParticles(x, y) {
    if (!isUnlocked) return;
    for (let i = 0; i < 2; i++) {
        particlesArray.push(new Particle(x, y));
    }
}

window.addEventListener('mousemove', (e) => spawnTrailParticles(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        spawnTrailParticles(e.touches[0].clientX, e.touches[0].clientY);
    }
});


// 2. SNOW MASK FOREGROUND CARVING ENGINE
const snowCanvas = document.getElementById('snow-canvas');
const snowCtx = snowCanvas.getContext('2d');
let drawing = false;

function initSnowCanvas() {
    const container = snowCanvas.parentElement;
    snowCanvas.width = container.offsetWidth;
    snowCanvas.height = container.offsetHeight;
    
    snowCtx.fillStyle = '#f3f4f6';
    snowCtx.fillRect(0, 0, snowCanvas.width, snowCanvas.height);
    
    snowCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 250; i++) {
        snowCtx.fillRect(Math.random() * snowCanvas.width, Math.random() * snowCanvas.height, 2, 2);
    }
}

function getSnowCoordinates(e) {
    const rect = snowCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function startCarving(e) {
    if (!isUnlocked) return;
    drawing = true;
    carve(e);
}

function stopCarving() {
    drawing = false;
    snowCtx.beginPath();
}

function carve(e) {
    if (!drawing || !isUnlocked) return;
    const pos = getSnowCoordinates(e);
    
    snowCtx.globalCompositeOperation = 'destination-out';
    snowCtx.lineWidth = 40; 
    snowCtx.lineCap = 'round';
    snowCtx.lineJoin = 'round';
    
    snowCtx.lineTo(pos.x, pos.y);
    snowCtx.stroke();
    snowCtx.beginPath();
    snowCtx.moveTo(pos.x, pos.y);
}

snowCanvas.addEventListener('mousedown', startCarving);
snowCanvas.addEventListener('mousemove', carve);
window.addEventListener('mouseup', stopCarving);

snowCanvas.addEventListener('touchstart', startCarving);
snowCanvas.addEventListener('touchmove', carve);
window.addEventListener('touchend', stopCarving);

// Global Background Floaties
function createFloatingElement() {
    const env = document.getElementById("animation-env");
    const symbols = ['🎈', '❤️', '🌸', '🤍'];
    const span = document.createElement("span");
    span.classList.add("floating-element");
    span.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    span.style.left = Math.random() * 100 + "vw";
    span.style.fontSize = Math.random() * 1.5 + 12 + "px";
    const duration = Math.random() * 3 + 5;
    span.style.animationDuration = duration + "s";
    env.appendChild(span);
    setTimeout(() => span.remove(), duration * 1000);
}

// Global Activation Event
document.getElementById("open-btn").addEventListener("click", () => {
    isUnlocked = true;
    
    const overlay = document.getElementById("surprise-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.visibility = "hidden", 800);
    
    document.getElementById("main-content").classList.remove("blurred");
    
    const music = document.getElementById("bg-music");
    music.play().catch(err => console.log("Audio waiting:", err));
    
    setTimeout(initSnowCanvas, 150);
    setInterval(createFloatingElement, 400);
});
