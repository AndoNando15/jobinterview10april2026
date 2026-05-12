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

// Smoothing variables
let noseSmooth = null;
let fingerSmooth = null;
const SMOOTHING_FACTOR = 0.35; // Balance between lag and jitter

// Initialize 5 stickers
const stickers = [];
for (let i = 0; i < 5; i++) {
    const s = document.createElement('div');
    s.className = 'bird-sticker';
    stickerContainer.appendChild(s);
    stickers.push(s);
}

function drawVideoFrame(results) {
    if (!results.image) return;
    if (canvasElement.width !== videoElement.videoWidth || canvasElement.height !== videoElement.videoHeight) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.restore();
}

function smoothPoint(prev, next) {
    if (!prev) return next;
    if (!next) return prev; // If next is null, keep previous to avoid flicker? No, better null.
    return {
        x: prev.x * (1 - SMOOTH_FACTOR) + next.x * SMOOTH_FACTOR,
        y: prev.y * (1 - SMOOTH_FACTOR) + next.y * SMOOTH_FACTOR
    };
}
// Using a slightly different approach for smoothing point to avoid undefined reference if I use it before definition.
// Actually let's just define it properly.

function onResults(results) {
    drawVideoFrame(results);

    // Get Nose Tip (Landmark 4 in FaceMesh)
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const rawNose = results.multiFaceLandmarks[0][4];
        noseSmooth = noseSmooth ? {
            x: noseSmooth.x * (1 - SMOOTHING_FACTOR) + rawNose.x * SMOOTHING_FACTOR,
            y: noseSmooth.y * (1 - SMOOTHING_FACTOR) + rawNose.y * SMOOTHING_FACTOR
        } : rawNose;
        noseLandmark = noseSmooth;
    } else {
        noseLandmark = null;
        noseSmooth = null;
    }

    checkCollision();
}

// HAND RESULTS
function onHandResults(results) {
    drawVideoFrame(results);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Index Finger Tip is Landmark 8
        const rawFinger = results.multiHandLandmarks[0][8];
        fingerSmooth = fingerSmooth ? {
            x: fingerSmooth.x * (1 - SMOOTHING_FACTOR) + rawFinger.x * SMOOTHING_FACTOR,
            y: fingerSmooth.y * (1 - SMOOTHING_FACTOR) + rawFinger.y * SMOOTHING_FACTOR
        } : rawFinger;
        fingerLandmark = fingerSmooth;
    } else {
        fingerLandmark = null;
        fingerSmooth = null;
    }

    checkCollision();
}

function checkCollision() {
    if (noseLandmark && fingerLandmark) {
        const dx = (noseLandmark.x - fingerLandmark.x) * canvasElement.width;
        const dy = (noseLandmark.y - fingerLandmark.y) * canvasElement.height;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Responsive threshold
        if (distance < 55) {
            if (!isTriggered) triggerEffect();
        } else {
            if (isTriggered) resetEffect();
        }
    } else {
        if (isTriggered) resetEffect();
    }
}

function triggerEffect() {
    isTriggered = true;
    statusText.innerText = "KICAUUUU!";
    textFeedback.classList.add('active');

    const isMobile = window.innerWidth <= 768;
    
    // Responsive positions for mobile (portrait) vs desktop (landscape)
    const positions = isMobile ? [
        { x: 10, y: 15 },
        { x: 60, y: 10 },
        { x: 15, y: 65 },
        { x: 45, y: 75 },
        { x: 65, y: 60 }
    ] : [
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
}

function resetEffect() {
    isTriggered = false;
    statusText.innerText = "Sentuh hidungmu untuk mengicau...";
    textFeedback.classList.remove('active');
    stickers.forEach(s => s.classList.remove('active'));
}

// MediaPipe Setup
const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    selfieMode: true
});
faceMesh.onResults(onResults);

const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    selfieMode: true
});
hands.onResults(onHandResults);

let skipFrame = false;
const camera = new Camera(videoElement, {
    onFrame: async () => {
        // Alternate frames to reduce CPU load by 50%
        if (skipFrame) {
            await faceMesh.send({ image: videoElement });
        } else {
            await hands.send({ image: videoElement });
        }
        skipFrame = !skipFrame;
    },
    width: 480,
    height: 270
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
