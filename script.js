document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('timer');
  const phaseDisplay = document.getElementById('phase');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const presetButtons = document.querySelectorAll('.preset-btn');

  let timer = null;
  let timeLeft = 0;
  let isRunning = false;
  let currentMode = null;
  let currentPhase = 0;

  const icons = {
    play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 19H6V5h8v14zM8 7v10h4V7H8z"/></svg>`
  };

  const techniques = {
    boxBreathing: {
      name: "Box Breathing",
      intervals: [
        { phase: "Inhale", time: 4 },
        { phase: "Hold", time: 4 },
        { phase: "Exhale", time: 4 },
        { phase: "Hold", time: 4 }
      ]
    },
    '478': {
      name: "4-7-8 Breathing",
      intervals: [
        { phase: "Inhale", time: 4 },
        { phase: "Hold", time: 7 },
        { phase: "Exhale", time: 8 }
      ]
    },
    '5min': { name: "5 Minute", duration: 300 },
    '10min': { name: "10 Minute", duration: 600 },
    '20min': { name: "20 Minute", duration: 1200 }
  };

  const formatTime = (seconds) => {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const updateDisplay = () => {
    timerDisplay.textContent = formatTime(timeLeft);
  };

  const startTimer = () => {
    if (isRunning) return;
    if (!currentMode) {
      phaseDisplay.textContent = "Please select a practice";
      return;
    }

    isRunning = true;
    startBtn.innerHTML = icons.pause;

    if (currentMode === 'boxBreathing' || currentMode === '478') {
      if (timeLeft <= 0) {
        currentPhase = 0;
        timeLeft = techniques[currentMode].intervals[0].time;
        phaseDisplay.textContent = techniques[currentMode].intervals[0].phase;
      }
    } else {
      if (timeLeft <= 0) {
        timeLeft = techniques[currentMode].duration;
      }
      phaseDisplay.textContent = techniques[currentMode].
