let isUnlocked = false;
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

// Size the canvas dynamically to match its container box bounds
function initSnowCanvas() {
    const box = canvas.parentElement;
    canvas.width = box.clientWidth;
    canvas.height = box.clientHeight;
    
    // Fill with a glistening snowy white gradient texture
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#eef2f3');
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, '#e4e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Optional: Add fine grain sparkles to look like real crystalized snow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 400; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }
}

// Window resizing adjustments
window.addEventListener('resize', () => {
    if(isUnlocked) initSnowCanvas();
});

// Touch and Move Carving Physics
let drawing = false;

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    // Handle both mouse clicks and mobile touch parameters
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
    ctx.beginPath(); // Resets path breaks between drags
}

function carve(e) {
    if (!drawing || !isUnlocked) return;
    
    const pos = getCoordinates(e);
    
    // Magic line component configuration: 'destination-out' acts as an absolute eraser mask
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 32; // Thick path size to resemble finger carvings in deep snow
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Event Listeners for Touch Screen Actions
canvas.addEventListener('mousedown', startCarving);
canvas.addEventListener('mousemove', carve);
window.addEventListener('mouseup', stopCarving);

canvas.addEventListener('touchstart', startCarving);
canvas.addEventListener('touchmove', carve);
window.addEventListener('touchend', stopCarving);

// Unlock Master Site Flow
document.getElementById("open-btn").addEventListener("click", () => {
    isUnlocked = true;
    
    const overlay = document.getElementById("surprise-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.visibility = "hidden", 1200);
    
    document.getElementById("main-content").classList.remove("blurred");
    
    const music = document.getElementById("bg-music");
    music.play().catch(err => console.log("Audio waiting for touch:", err));
    
    // Render the pristine snow pile once unlocked
    initSnowCanvas();
});