// ==========================
// Clock with Ticking Sound
// ==========================

// Check if ticking sound is enabled from previous session
let tickingEnabled = localStorage.getItem('tickingEnabled') === 'true';
const tickSound = document.getElementById('tickSound');
const soundToggle = document.getElementById('soundToggle');

// Play tick sound if enabled
function playTick() {
    if (tickingEnabled) {
        tickSound.currentTime = 0; // Rewind to start
        tickSound.play();
    }
}

// Update digital clock and date every second
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // If 0, display 12
    hours = hours.toString().padStart(2, '0');

    // Update time on UI
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('ampm').textContent = ampm;

    // Show formatted date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString(undefined, options);

    playTick(); // Play tick sound on update
}

// Keep the clock ticking
setInterval(updateClock, 1000);
updateClock(); // Initial clock update

// Update sound toggle button text
function updateSoundToggleBtn() {
    soundToggle.textContent = tickingEnabled ? 'Disable Ticking Sound' : 'Enable Ticking Sound';
}

// Handle toggle button click
soundToggle.addEventListener('click', () => {
    tickingEnabled = !tickingEnabled;
    localStorage.setItem('tickingEnabled', tickingEnabled);
    updateSoundToggleBtn();
});

updateSoundToggleBtn(); // Set initial state


// ==========================
// Stopwatch Functionality
// ==========================

let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCount = 0;
let lastLapTime = 0;
let pausedTime = 0;
let lapTimes = [];

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapList = document.getElementById('lapList');

// Start the stopwatch
function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - (elapsedTime + pausedTime); // Resume from paused time
        timerInterval = setInterval(updateStopwatch, 10);
        startBtn.disabled = true;
        stopBtn.disabled = false;
        lapBtn.disabled = false;
    }
}

// Pause the stopwatch
function stopStopwatch() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        pausedTime = Date.now() - startTime - elapsedTime;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        lapBtn.disabled = true;
    }
}

// Reset stopwatch to zero
function resetStopwatch() {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime = 0;
    pausedTime = 0;
    lapCount = 0;
    lastLapTime = 0;
    lapTimes = [];

    updateStopwatchDisplay(0);
    startBtn.disabled = false;
    stopBtn.disabled = false;
    lapBtn.disabled = true;
    lapList.innerHTML = ''; // Clear all laps
}

// Record a lap
function addLap() {
    if (isRunning) {
        lapCount++;
        const currentLapTime = elapsedTime;
        const lapTime = currentLapTime - lastLapTime;
        lastLapTime = currentLapTime;

        lapTimes.push({
            lapNumber: lapCount,
            totalTime: currentLapTime,
            lapTime: lapTime
        });

        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span>Lap ${lapCount}</span>
            <span>${formatTime(lapTime)}</span>
        `;
        lapList.insertBefore(lapItem, lapList.firstChild); // Add lap at the top
    }
}

// Format time in hh:mm:ss.ms
function formatTime(time) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

// Update elapsed time on screen
function updateStopwatch() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    updateStopwatchDisplay(elapsedTime);
}

// Reflect stopwatch time on UI
function updateStopwatchDisplay(time) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    document.getElementById('sw-hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('sw-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('sw-seconds').textContent = seconds.toString().padStart(2, '0');
    document.getElementById('sw-milliseconds').textContent = milliseconds.toString().padStart(2, '0');
}


// ==========================
// Dark Mode Toggle
// ==========================

const themeToggle = document.getElementById('themeToggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Toggle theme and remember choice
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDarkMode);
    themeToggle.textContent = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
}

// Apply dark mode if previously selected
if (isDarkMode) {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Toggle Light Mode';
}


// ==========================
// Event Listeners
// ==========================

startBtn.addEventListener('click', startStopwatch);
stopBtn.addEventListener('click', stopStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', addLap);
themeToggle.addEventListener('click', toggleDarkMode);

// Initialize stopwatch UI to 00:00:00.00
resetStopwatch();
