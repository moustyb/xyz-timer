document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const timerDisplay = document.getElementById('timer');
  const phaseDisplay = document.getElementById('phase');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const presetButtons = document.querySelectorAll('.preset-btn');
  const themeSwitch = document.getElementById('themeSwitch');
  const gradientSwitch = document.getElementById('gradientSwitch');
  
  // App State
  let timer;
  let timeLeft = 0;
  let isRunning = false;
  let currentMode = null;
  let currentPhase = 0;
  
  // Load saved preferences
  const savedTheme = localStorage.getItem('xyzTimerTheme') || 'dark';
  const savedGradient = localStorage.getItem('xyzTimerGradient') === 'true' || true;
  
  // Apply initial state
  document.body.classList.add(savedTheme === 'dark' ? 'dark-theme' : 'light-theme');
  gradientSwitch.checked = savedGradient;
  
  // Set initial background
  updateBackground(savedTheme === 'dark', savedGradient);
  
  // Timer functionality
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
    5min: { name: "5 Minute", duration: 300 },
    10min: { name: "10 Minute", duration: 600 },
    20min: { name: "20 Minute", duration: 1200 }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const updateDisplay = () => {
    if (currentMode === 'boxBreathing' || currentMode === '478') {
      timerDisplay.textContent = formatTime(
        techniques[currentMode].intervals[currentPhase].time
      );
    } else {
      timerDisplay.textContent = formatTime(timeLeft);
    }
  };
  
  const startTimer = () => {
    if (isRunning) return;
    if (!currentMode) {
      phaseDisplay.textContent = "Please select a practice";
      return;
    }
    
    isRunning = true;
    startBtn.disabled = true;
    
    if (currentMode === 'boxBreathing' || currentMode === '478') {
      currentPhase = 0;
      timeLeft = techniques[currentMode].intervals[0].time;
      phaseDisplay.textContent = techniques[currentMode].intervals[0].phase;
    } else {
      timeLeft = techniques[currentMode].duration;
      phaseDisplay.textContent = techniques[currentMode].name;
    }
    
    updateDisplay();
    
    timer = setInterval(() => {
      timeLeft--;
      
      if (currentMode === 'boxBreathing' || currentMode === '478') {
        const intervals = techniques[currentMode].intervals;
        if (timeLeft <= 0) {
          currentPhase = (currentPhase + 1) % intervals.length;
          timeLeft = intervals[currentPhase].time;
          phaseDisplay.textContent = intervals[currentPhase].phase;
        }
      } else {
        if (timeLeft <= 0) {
          clearInterval(timer);
          isRunning = false;
          phaseDisplay.textContent = "Complete";
          timerDisplay.textContent = "00:00";
          startBtn.disabled = false;
          startBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
          return;
        }
      }
      
      updateDisplay();
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(timer);
    isRunning = false;
    startBtn.disabled = false;
  };
  
  const resetTimer = () => {
    stopTimer();
    timeLeft = 0;
    currentPhase = 0;
    phaseDisplay.textContent = currentMode ? techniques[currentMode].name : "Select a practice";
    timerDisplay.textContent = "00:00";
  };
  
  const updateBackground = (isDark, useGradient) => {
    document.body.style.background = useGradient ? 
      (isDark ? 'var(--bg-gradient)' : 'var(--bg-gradient)') : 
      (isDark ? 'var(--bg-solid)' : 'var(--bg-solid)');
  };
  
  // Event Listeners
  themeSwitch.addEventListener('change', () => {
    const isDark = themeSwitch.checked;
    localStorage.setItem('xyzTimerTheme', isDark ? 'dark' : 'light');
    
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
    
    updateBackground(isDark, gradientSwitch.checked);
  });
  
  gradientSwitch.addEventListener('change', () => {
    const useGradient = gradientSwitch.checked;
    localStorage.setItem('xyzTimerGradient', useGradient);
    
    const isDark = document.body.classList.contains('dark-theme');
    updateBackground(isDark, useGradient);
  });
  
  startBtn.addEventListener('click', () => {
    if (isRunning) {
      stopTimer();
      startBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
    } else {
      startTimer();
      startBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 19H6V5h8v14zM8 7v10h4V7H8z"/></svg>`;
    }
  });
  
  resetBtn.addEventListener('click', resetTimer);
  
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      resetTimer();
      
      phaseDisplay.textContent = techniques[currentMode].name;
      timerDisplay.textContent = "00:00";
    });
  });
  
  // Initialize UI
  themeSwitch.checked = savedTheme === 'dark';
  phaseDisplay.textContent = "Select a practice";
  timerDisplay.textContent = "00:00";
});
