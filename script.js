let isUnlocked = false;
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

function initFullSnow() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create soft textured deep snow surface color
    ctx.fillStyle = '#f8fafc'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add ice-blue subtle variations for deep snow texture packed together
    for (let i = 0; i < 700; i++) {
        ctx.fillStyle = ['#e2e8f0', '#edf2f7', '#ffffff'][Math.floor(Math.random() * 3)];
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.addEventListener('resize', () => {
    if (isUnlocked) initFullSnow();
});

// Atmospheric Flurry Effects
function spawnSnowflake() {
    if (!isUnlocked) return;
    const env = document.getElementById('blizzard-env');
    const flake = document.createElement('div');
    flake.classList.add('snowflake');
    flake.innerText = ['❄️', '•', '✧'][Math.floor(Math.random() * 3)];
    
    flake.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 0.8 + 0.5;
    flake.style.transform = `scale(${size})`;
    
    const duration = Math.random() * 3 + 4; // 4s to 7s
    flake.style.animationDuration = duration + 's';
    
    env.appendChild(flake);
    setTimeout(() => flake.remove(), duration * 1000);
}

// Carving Mechanics
let drawing = false;

function getCoordinates(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX, y: clientY };
}

function startCarving(e) {
    if (!isUnlocked) return;
    drawing = true;
    carve(e);
}

function stopCarving() {
    drawing = false;
    ctx.beginPath();
}

function carve(e) {
    if (!drawing || !isUnlocked) return;
    const pos = getCoordinates(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    
    // Deep Carving shadow look inside canvas mask
    ctx.lineWidth = 45; // Thick finger-width path
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Smooth out paths seamlessly
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Global Touch Listeners
canvas.addEventListener('mousedown', startCarving);
canvas.addEventListener('mousemove', carve);
window.addEventListener('mouseup', stopCarving);

canvas.addEventListener('touchstart', startCarving);
canvas.addEventListener('touchmove', carve);
window.addEventListener('touchend', stopCarving);

// Master Activation Trigger
document.getElementById("open-btn").addEventListener("click", () => {
    isUnlocked = true;
    
    const overlay = document.getElementById("surprise-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.visibility = "hidden", 800);
    
    document.getElementById("main-content").classList.remove("blurred");
    
    const music = document.getElementById("bg-music");
    music.play().catch(err => console.log("Audio waiting..."));
    
    initFullSnow();
    setInterval(spawnSnowflake, 150); // Continual blizzard flurry loops
});
