const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const stickerContainer = document.getElementById('sticker-container');
const textFeedback = document.getElementById('text-feedback');
const kicauSound = document.getElementById('kicau-sound');
const statusText = document.getElementById('status-text');

let isTriggered = false;
let noseLandmark = null;
let fingerLandmark = null;

// Initialize 5 stickers
const stickers = [];
for (let i = 0; i < 5; i++) {
    const s = document.createElement('div');
    s.className = 'bird-sticker';
    stickerContainer.appendChild(s);
    stickers.push(s);
}

function onResults(results) {
    // Canvas sizing
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // Get Nose Tip (Landmark 4 in FaceMesh)
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        noseLandmark = results.multiFaceLandmarks[0][4];
    } else {
        noseLandmark = null;
    }

    // Hands are handled by a separate MediaPipe instance or we combine them.
    // However, to keep it simple and performant, we use FaceMesh and assume 
    // the hand tracking will be handled by a separate Hands object if needed.
    // Let's actually use both.

    checkCollision();
    canvasCtx.restore();
}

// HAND RESULTS
function onHandResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Index Finger Tip is Landmark 8
        fingerLandmark = results.multiHandLandmarks[0][8];
    } else {
        fingerLandmark = null;
    }
}

function checkCollision() {
    if (noseLandmark && fingerLandmark && !isTriggered) {
        const dx = (noseLandmark.x - fingerLandmark.x) * canvasElement.width;
        const dy = (noseLandmark.y - fingerLandmark.y) * canvasElement.height;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Threshold for touch (pixels)
        if (distance < 50) {
            triggerEffect();
        }
    }
}

function triggerEffect() {
    isTriggered = true;
    statusText.innerText = "KICAUUUU!";
    
    // Text feedback shows on touch

    // Show Text
    textFeedback.classList.add('active');

    // Fixed positions based on user's drawing
    const positions = [
        { x: 15, y: 20 },
        { x: 70, y: 25 },
        { x: 20, y: 70 },
        { x: 50, y: 80 },
        { x: 75, y: 75 }
    ];

    stickers.forEach((s, i) => {
        const pos = positions[i];
        s.style.left = `${pos.x}%`;
        s.style.top = `${pos.y}%`;
        s.classList.add('active');
    });

    // Reset after 3 seconds
    setTimeout(() => {
        isTriggered = false;
        statusText.innerText = "Sentuh hidungmu untuk mengicau...";
        textFeedback.classList.remove('active');
        stickers.forEach(s => s.classList.remove('active'));
    }, 3000);
}

// MediaPipe Setup
const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onHandResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({image: videoElement});
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});

camera.start().then(() => {
    statusText.innerText = "Kamera aktif. Sentuh hidungmu!";
    // Start background music looping
    kicauSound.play().catch(e => {
        console.log("Audio play failed (waiting for user interaction):", e);
        statusText.innerText = "Klik layar untuk mengicau...";
        document.body.addEventListener('click', () => {
            kicauSound.play();
            statusText.innerText = "Kamera aktif. Sentuh hidungmu!";
        }, { once: true });
    });
});
