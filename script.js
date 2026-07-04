let isUnlocked = false;
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

function initSnowCanvas() {
    const container = canvas.parentElement;
    
    // Explicitly grab actual pixels matching the container sizing
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    // Create a pristine snowy surface
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Soft metallic texture overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 250; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
}

window.addEventListener('resize', () => {
    if (isUnlocked) initSnowCanvas();
});

// Drawing State Machine
let drawing = false;

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
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
    ctx.beginPath();
}

function carve(e) {
    if (!drawing || !isUnlocked) return;
    const pos = getCoordinates(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 36; // Premium thick brush path
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

canvas.addEventListener('mousedown', startCarving);
canvas.addEventListener('mousemove', carve);
window.addEventListener('mouseup', stopCarving);

canvas.addEventListener('touchstart', startCarving);
canvas.addEventListener('touchmove', carve);
window.addEventListener('touchend', stopCarving);

// Unlock Button Action
document.getElementById("open-btn").addEventListener("click", () => {
    isUnlocked = true;
    
    const overlay = document.getElementById("surprise-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.visibility = "hidden", 800);
    
    document.getElementById("main-content").classList.remove("blurred");
    
    const music = document.getElementById("bg-music");
    music.play().catch(err => console.log("Audio play postponed:", err));
    
    // Give it a tiny pause for layout rendering before running canvas dimensions
    setTimeout(initSnowCanvas, 150);
});
