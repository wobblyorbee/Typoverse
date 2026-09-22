/* -------------------------------------------------------------
   TypoVerse — Application Logic & Web Audio Synthesizer
   ------------------------------------------------------------- */

// --- Word Lists & Code Snippets ---
const DICTIONARIES = {
  id: [
    "yang", "untuk", "pada", "dengan", "adalah", "ini", "dari", "dalam", "tidak", "akan",
    "juga", "sudah", "bisa", "lebih", "mereka", "kita", "kamu", "saya", "tapi", "karena",
    "oleh", "sebagai", "setelah", "sampai", "hanya", "sangat", "banyak", "antara", "saat",
    "harus", "bukan", "tentang", "mungkin", "kembali", "kemudian", "semua", "bahkan", "tanpa",
    "seperti", "sedang", "bila", "hampir", "selalu", "pertama", "waktu", "jalan", "hari",
    "tahun", "kehidupan", "manusia", "dunia", "teknologi", "pemrograman", "komputer", "sistem",
    "aplikasi", "jaringan", "logika", "algoritma", "fungsi", "struktur", "kecepatan", "fokus",
    "belajar", "praktik", "berpikir", "inovasi", "kreatif", "sukses", "tujuan", "impian"
  ],
  en: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on",
    "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we",
    "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their",
    "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
    "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into",
    "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now",
    "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two",
    "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any"
  ],
  quotes: [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
    { text: "In order to be irreplaceable, one must always be different.", author: "Coco Chanel" },
    { text: "Disiplin dan konsistensi adalah jembatan antara tujuan dan pencapaian nyata.", author: "Anonim" },
    { text: "Kode yang bersih selalu terlihat seperti ditulis oleh seseorang yang peduli.", author: "Robert C. Martin" }
  ],
  code: {
    javascript: [
      "const debounce = (fn, ms = 300) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }; };",
      "const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);",
      "const uniqueArray = (arr) => [...new Set(arr)].filter(Boolean);",
      "async function fetchUserData(userId) { const res = await fetch(`/api/user/${userId}`); return await res.json(); }",
      "const calculateTotal = (items) => items.reduce((acc, item) => acc + item.price * item.qty, 0);",
      "const deepClone = (obj) => JSON.parse(JSON.stringify(obj));"
    ],
    python: [
      "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1",
      "def get_prime_numbers(n):\n    primes = []\n    for num in range(2, n + 1):\n        if all(num % i != 0 for i in range(2, int(num ** 0.5) + 1)):\n            primes.append(num)\n    return primes",
      "class Node:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      "def quicksort(array):\n    if len(array) <= 1: return array\n    pivot = array[len(array) // 2]\n    return quicksort([x for x in array if x < pivot]) + [x for x in array if x == pivot] + quicksort([x for x in array if x > pivot])"
    ],
    html_css: [
      "<div class=\"card glass-effect\">\n  <h2 class=\"title\">Hello World</h2>\n  <button class=\"btn-glow\">Click Me</button>\n</div>",
      ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  backdrop-filter: blur(10px);\n}",
      "@keyframes pulse {\n  0% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.05); opacity: 0.8; }\n  100% { transform: scale(1); opacity: 1; }\n}"
    ]
  }
};

// --- Web Audio Synthesizer (Zero External MP3 needed) ---
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.profile = "thock"; // 'thock', 'click', 'bubble', 'cyber'
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKeySound(isError = false) {
    if (this.muted) return;
    this.initContext();

    if (isError) {
      this.playErrorSound();
      return;
    }

    switch (this.profile) {
      case 'thock':
        this.playThock();
        break;
      case 'click':
        this.playClick();
        break;
      case 'bubble':
        this.playBubble();
        break;
      case 'cyber':
        this.playCyber();
        break;
      default:
        this.playThock();
    }
  }

  playThock() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    
    // Low mechanical pitch
    const baseFreq = 140 + Math.random() * 30;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.04);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  playClick() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 + Math.random() * 300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  playBubble() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350 + Math.random() * 150, now);
    osc.frequency.exponentialRampToValueAtTime(700 + Math.random() * 100, now + 0.035);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playCyber() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  playErrorSound() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

// --- App State ---
class TypoVerseApp {
  constructor() {
    // Configs
    this.primaryMode = 'time'; // 'time', 'words', 'quote', 'code'
    this.subOption = 30; // 15, 30, 60 (time) or 25, 50, 100 (words) or 'javascript', 'python'
    this.language = 'id'; // 'id', 'en'
    this.theme = localStorage.getItem('typo_theme') || 'tokyo-night';

    // Test State
    this.sound = new SoundEffects();
    this.testActive = false;
    this.testFinished = false;
    this.startTime = null;
    this.timerInterval = null;
    this.timeLeft = 30;
    this.wpmHistory = []; // array of { sec, wpm, raw, errors }
    this.streak = 0;

    // Word Tracking
    this.wordsList = [];
    this.currentWordIndex = 0;
    this.currentLetterIndex = 0;
    this.correctCharsCount = 0;
    this.incorrectCharsCount = 0;
    this.extraCharsCount = 0;
    this.missedCharsCount = 0;

    // Chart Instance
    this.chartInstance = null;

    // DOM Elements
    this.initElements();
    this.initEvents();
    this.applyTheme(this.theme);
    this.renderSubOptions();
    this.generateWords();
    this.updateStatsModalContent();
  }

  initElements() {
    // UI controls
    this.themePickerBtn = document.getElementById('themePickerBtn');
    this.themeDropdown = document.getElementById('themeDropdown');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.soundProfileSelect = document.getElementById('soundProfileSelect');
    this.statsModalBtn = document.getElementById('statsModalBtn');
    this.statsModal = document.getElementById('statsModal');
    this.closeStatsBtn = document.getElementById('closeStatsBtn');
    this.clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Nav Groups
    this.primaryModeGroup = document.getElementById('primaryModeGroup');
    this.subOptionGroup = document.getElementById('subOptionGroup');
    this.langGroup = document.getElementById('langGroup');

    // Arena
    this.typingWrapper = document.getElementById('typingWrapper');
    this.typingInput = document.getElementById('typingInput');
    this.wordsContainer = document.getElementById('wordsContainer');
    this.caret = document.getElementById('caret');
    this.unfocusedOverlay = document.getElementById('unfocusedOverlay');
    this.restartBtn = document.getElementById('restartBtn');
    this.capsLockAlert = document.getElementById('capsLockAlert');

    // HUD
    this.hudTimer = document.getElementById('hudTimer');
    this.hudTimerLabel = document.getElementById('hudTimerLabel');
    this.hudWpm = document.getElementById('hudWpm');
    this.hudAcc = document.getElementById('hudAcc');
    this.hudStreak = document.getElementById('hudStreak');

    // Result Screen
    this.resultScreen = document.getElementById('resultScreen');
    this.resultWpm = document.getElementById('resultWpm');
    this.resultRawWpm = document.getElementById('resultRawWpm');
    this.resultAccuracy = document.getElementById('resultAccuracy');
    this.resultAccuracyDetails = document.getElementById('resultAccuracyDetails');
    this.resultConsistency = document.getElementById('resultConsistency');
    this.resultChars = document.getElementById('resultChars');
    this.performanceRank = document.getElementById('performanceRank');
    this.resultSubtitle = document.getElementById('resultSubtitle');
    this.nextTestBtn = document.getElementById('nextTestBtn');
    this.repeatTestBtn = document.getElementById('repeatTestBtn');
    this.copyResultBtn = document.getElementById('copyResultBtn');

    // Canvas
    this.chartCanvas = document.getElementById('wpmChart');
  }

  initEvents() {
    // Theme toggle
    this.themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.themeDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!this.themeDropdown.contains(e.target) && e.target !== this.themePickerBtn) {
        this.themeDropdown.classList.add('hidden');
      }
    });

    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedTheme = opt.dataset.theme;
        this.applyTheme(selectedTheme);
        this.themeDropdown.classList.add('hidden');
      });
    });

    // Sound toggle & profile
    this.soundToggleBtn.addEventListener('click', () => {
      this.sound.muted = !this.sound.muted;
      this.soundIcon.className = this.sound.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    });

    this.soundProfileSelect.addEventListener('change', (e) => {
      this.sound.profile = e.target.value;
      this.sound.playKeySound(false);
      this.focusTyping();
    });

    // Stats Modal
    this.statsModalBtn.addEventListener('click', () => {
      this.updateStatsModalContent();
      this.statsModal.classList.remove('hidden');
    });

    this.closeStatsBtn.addEventListener('click', () => {
      this.statsModal.classList.add('hidden');
      this.focusTyping();
    });

    this.statsModal.querySelector('.modal-backdrop').addEventListener('click', () => {
      this.statsModal.classList.add('hidden');
      this.focusTyping();
    });

    this.clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Hapus semua riwayat latihan mengetik Anda?')) {
        localStorage.removeItem('typo_history');
        this.updateStatsModalContent();
      }
    });

    // Primary Mode Buttons
    this.primaryModeGroup.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.primaryModeGroup.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.primaryMode = btn.dataset.mode;
        
        // Adjust language group visibility
        if (this.primaryMode === 'code') {
          this.langGroup.classList.add('hidden');
        } else {
          this.langGroup.classList.remove('hidden');
        }

        this.renderSubOptions();
        this.resetTest();
      });
    });

    // Language Buttons
    this.langGroup.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.langGroup.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.language = btn.dataset.lang;
        this.resetTest();
      });
    });

    // Arena Focus
    this.typingWrapper.addEventListener('click', () => this.focusTyping());
    this.unfocusedOverlay.addEventListener('click', () => this.focusTyping());

    window.addEventListener('keydown', (e) => {
      // Hotkeys
      if (e.key === 'Tab') {
        // Tab + Enter restart helper
        this._tabPressed = true;
        setTimeout(() => this._tabPressed = false, 1000);
      }
      if (e.key === 'Enter' && this._tabPressed) {
        e.preventDefault();
        this.resetTest();
        return;
      }
      if (e.key === 'Escape') {
        this.focusTyping();
      }
      if (e.key === 'm' || e.key === 'M') {
        if (document.activeElement !== this.typingInput) {
          this.soundToggleBtn.click();
        }
      }

      // Check Caps Lock
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        this.capsLockAlert.classList.remove('hidden');
      } else {
        this.capsLockAlert.classList.add('hidden');
      }

      // Auto focus on any alphanumeric key
      if (!this.statsModal.classList.contains('hidden')) return;
      if (document.activeElement !== this.typingInput && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.focusTyping();
      }
    });

    // Input handlers
    this.typingInput.addEventListener('input', (e) => this.handleInput(e));
    this.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));

    this.typingInput.addEventListener('focus', () => {
      this.unfocusedOverlay.classList.add('hidden');
    });

    this.typingInput.addEventListener('blur', () => {
      if (!this.testFinished && !this.statsModal.classList.contains('hidden') && !this.themeDropdown.classList.contains('hidden')) {
        return;
      }
      if (!this.testFinished) {
        this.unfocusedOverlay.classList.remove('hidden');
      }
    });

    // Arena Restart Button
    this.restartBtn.addEventListener('click', () => this.resetTest());

    // Result Buttons
    this.nextTestBtn.addEventListener('click', () => this.resetTest());
    this.repeatTestBtn.addEventListener('click', () => this.resetTest(true));
    this.copyResultBtn.addEventListener('click', () => this.copyResultsToClipboard());

    window.addEventListener('resize', () => {
      this.updateCaretPosition();
    });
  }

  applyTheme(themeName) {
    this.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('typo_theme', themeName);

    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeName);
    });
  }

  renderSubOptions() {
    this.subOptionGroup.innerHTML = '';
    let options = [];

    if (this.primaryMode === 'time') {
      options = [
        { label: '15s', value: 15 },
        { label: '30s', value: 30 },
        { label: '60s', value: 60 },
        { label: '120s', value: 120 }
      ];
      this.subOption = this.subOption || 30;
      if (typeof this.subOption !== 'number') this.subOption = 30;
    } else if (this.primaryMode === 'words') {
      options = [
        { label: '10 kata', value: 10 },
        { label: '25 kata', value: 25 },
        { label: '50 kata', value: 50 },
        { label: '100 kata', value: 100 }
      ];
      this.subOption = 25;
    } else if (this.primaryMode === 'quote') {
      options = [
        { label: 'Random Quotes', value: 'all' }
      ];
      this.subOption = 'all';
    } else if (this.primaryMode === 'code') {
      options = [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'HTML/CSS', value: 'html_css' }
      ];
      this.subOption = 'javascript';
    }

    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = `sub-btn ${opt.value === this.subOption ? 'active' : ''}`;
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        this.subOptionGroup.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.subOption = opt.value;
        this.resetTest();
      });
      this.subOptionGroup.appendChild(btn);
    });
  }

  focusTyping() {
    this.unfocusedOverlay.classList.add('hidden');
    this.typingInput.focus();
  }

  generateWords(isRepeat = false) {
    if (!isRepeat) {
      this.wordsList = [];
      if (this.primaryMode === 'time') {
        const pool = DICTIONARIES[this.language];
        for (let i = 0; i < 150; i++) {
          this.wordsList.push(pool[Math.floor(Math.random() * pool.length)]);
        }
      } else if (this.primaryMode === 'words') {
        const pool = DICTIONARIES[this.language];
        const count = typeof this.subOption === 'number' ? this.subOption : 25;
        for (let i = 0; i < count; i++) {
          this.wordsList.push(pool[Math.floor(Math.random() * pool.length)]);
        }
      } else if (this.primaryMode === 'quote') {
        const quoteObj = DICTIONARIES.quotes[Math.floor(Math.random() * DICTIONARIES.quotes.length)];
        this.wordsList = quoteObj.text.split(' ');
        this._currentAuthor = quoteObj.author;
      } else if (this.primaryMode === 'code') {
        const lang = this.subOption || 'javascript';
        const codePool = DICTIONARIES.code[lang] || DICTIONARIES.code.javascript;
        const codeSnippet = codePool[Math.floor(Math.random() * codePool.length)];
        this.wordsList = codeSnippet.split(' ');
      }
    }

    // Render HTML
    this.wordsContainer.innerHTML = '';
    this.wordsList.forEach((wordStr, wIndex) => {
      const wordEl = document.createElement('div');
      wordEl.className = `word ${wIndex === 0 ? 'active' : ''}`;
      wordEl.dataset.index = wIndex;

      for (let i = 0; i < wordStr.length; i++) {
        const letterEl = document.createElement('span');
        letterEl.className = 'letter';
        letterEl.textContent = wordStr[i];
        wordEl.appendChild(letterEl);
      }

      this.wordsContainer.appendChild(wordEl);
    });

    this.currentWordIndex = 0;
    this.currentLetterIndex = 0;
    this.typingInput.value = '';

    // Scroll to top
    this.wordsContainer.scrollTop = 0;

    setTimeout(() => {
      this.updateCaretPosition();
    }, 50);
  }

  resetTest(isRepeat = false) {
    clearInterval(this.timerInterval);
    this.testActive = false;
    this.testFinished = false;
    this.startTime = null;
    this.wpmHistory = [];
    this.streak = 0;

    this.correctCharsCount = 0;
    this.incorrectCharsCount = 0;
    this.extraCharsCount = 0;
    this.missedCharsCount = 0;

    if (this.primaryMode === 'time') {
      this.timeLeft = typeof this.subOption === 'number' ? this.subOption : 30;
      this.hudTimerLabel.textContent = 'WAKTU';
      this.hudTimer.textContent = this.timeLeft;
    } else if (this.primaryMode === 'words') {
      this.hudTimerLabel.textContent = 'KATA';
      this.hudTimer.textContent = `0/${this.subOption}`;
    } else {
      this.hudTimerLabel.textContent = 'WAKTU';
      this.hudTimer.textContent = '0s';
    }

    this.hudWpm.textContent = '0';
    this.hudAcc.textContent = '100%';
    this.hudStreak.textContent = '0 🔥';

    this.resultScreen.classList.add('hidden');
    this.generateWords(isRepeat);
    this.focusTyping();
  }

  startTest() {
    this.testActive = true;
    this.startTime = Date.now();

    if (this.primaryMode === 'time') {
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        this.hudTimer.textContent = this.timeLeft;
        this.recordPerformanceTick();

        if (this.timeLeft <= 0) {
          this.finishTest();
        }
      }, 1000);
    } else {
      // Stopwatch mode
      let elapsedSec = 0;
      this.timerInterval = setInterval(() => {
        elapsedSec++;
        if (this.primaryMode !== 'words') {
          this.hudTimer.textContent = `${elapsedSec}s`;
        }
        this.recordPerformanceTick();
      }, 1000);
    }
  }

  handleKeyDown(e) {
    if (this.testFinished) return;

    // Space key: jump to next word
    if (e.key === ' ') {
      e.preventDefault();
      this.handleSpacePress();
      return;
    }

    // Backspace
    if (e.key === 'Backspace') {
      this.handleBackspace(e.ctrlKey);
      return;
    }
  }

  handleInput(e) {
    if (this.testFinished) return;

    if (!this.testActive && this.typingInput.value.length > 0) {
      this.startTest();
    }

    const inputVal = this.typingInput.value;
    const currentWordEl = this.wordsContainer.children[this.currentWordIndex];
    if (!currentWordEl) return;

    const originalWord = this.wordsList[this.currentWordIndex];
    const letterEls = currentWordEl.querySelectorAll('.letter:not(.extra)');
    
    // Clear extra letters if any
    currentWordEl.querySelectorAll('.letter.extra').forEach(el => el.remove());

    let hasErrorInCurrentWord = false;

    // Evaluate typed letters
    for (let i = 0; i < inputVal.length; i++) {
      const typedChar = inputVal[i];

      if (i < originalWord.length) {
        const expectedChar = originalWord[i];
        const letterEl = letterEls[i];

        if (typedChar === expectedChar) {
          letterEl.className = 'letter correct';
        } else {
          letterEl.className = 'letter incorrect';
          hasErrorInCurrentWord = true;
        }
      } else {
        // Extra characters typed
        const extraEl = document.createElement('span');
        extraEl.className = 'letter extra incorrect';
        extraEl.textContent = typedChar;
        currentWordEl.appendChild(extraEl);
        hasErrorInCurrentWord = true;
      }
    }

    // Reset unreached letters
    for (let i = inputVal.length; i < originalWord.length; i++) {
      letterEls[i].className = 'letter';
    }

    // Play Audio
    const lastChar = inputVal[inputVal.length - 1];
    const isError = hasErrorInCurrentWord && inputVal.length > 0;
    this.sound.playKeySound(isError);

    // Update streak
    if (!isError && inputVal.length > 0) {
      this.streak++;
    } else if (isError) {
      this.streak = 0;
    }
    this.hudStreak.textContent = `${this.streak} 🔥`;

    this.currentLetterIndex = inputVal.length;
    this.updateCaretPosition();
    this.updateLiveHud();

    // In quote, words, or code mode check if complete on last word
    if (this.currentWordIndex === this.wordsList.length - 1 && inputVal === originalWord) {
      this.finishTest();
    }
  }

  handleSpacePress() {
    const currentWordEl = this.wordsContainer.children[this.currentWordIndex];
    if (!currentWordEl) return;

    const inputVal = this.typingInput.value;
    const originalWord = this.wordsList[this.currentWordIndex];

    if (inputVal.length === 0) return; // ignore multiple spaces

    // Count correct / incorrect / missed characters
    const letterEls = currentWordEl.querySelectorAll('.letter:not(.extra)');
    let wordHasError = false;

    for (let i = 0; i < originalWord.length; i++) {
      if (i < inputVal.length) {
        if (inputVal[i] === originalWord[i]) {
          this.correctCharsCount++;
        } else {
          this.incorrectCharsCount++;
          wordHasError = true;
        }
      } else {
        this.missedCharsCount++;
        wordHasError = true;
      }
    }

    const extraCount = Math.max(0, inputVal.length - originalWord.length);
    this.extraCharsCount += extraCount;
    if (extraCount > 0) wordHasError = true;

    if (wordHasError) {
      currentWordEl.classList.add('error-word');
    }

    // Move to next word
    currentWordEl.classList.remove('active');
    this.currentWordIndex++;

    if (this.currentWordIndex >= this.wordsList.length) {
      this.finishTest();
      return;
    }

    const nextWordEl = this.wordsContainer.children[this.currentWordIndex];
    nextWordEl.classList.add('active');
    this.typingInput.value = '';
    this.currentLetterIndex = 0;

    // Check words mode counter
    if (this.primaryMode === 'words') {
      this.hudTimer.textContent = `${this.currentWordIndex}/${this.subOption}`;
    }

    // Scroll line if needed
    this.handleLineScroll(nextWordEl);
    this.updateCaretPosition();
    this.updateLiveHud();
  }

  handleBackspace(ctrlKey) {
    if (this.typingInput.value.length === 0 && this.currentWordIndex > 0) {
      // Go back to previous word if allowed
      const prevWordEl = this.wordsContainer.children[this.currentWordIndex - 1];
      if (prevWordEl.classList.contains('error-word')) {
        this.wordsContainer.children[this.currentWordIndex].classList.remove('active');
        this.currentWordIndex--;
        prevWordEl.classList.add('active');
        prevWordEl.classList.remove('error-word');

        // Reconstruct input value
        let reconstructed = '';
        prevWordEl.querySelectorAll('.letter').forEach(l => {
          reconstructed += l.textContent;
        });
        this.typingInput.value = reconstructed;
        this.currentLetterIndex = reconstructed.length;
        this.updateCaretPosition();
      }
    }
  }

  handleLineScroll(wordEl) {
    const containerTop = this.wordsContainer.getBoundingClientRect().top;
    const wordTop = wordEl.getBoundingClientRect().top;
    const diff = wordTop - containerTop;

    // If word wraps to line 2 or 3, scroll container smoothly
    if (diff > 55) {
      this.wordsContainer.scrollTop += diff - 10;
    }
  }

  updateCaretPosition() {
    const currentWordEl = this.wordsContainer.children[this.currentWordIndex];
    if (!currentWordEl) return;

    const containerRect = this.typingWrapper.getBoundingClientRect();
    const letters = currentWordEl.querySelectorAll('.letter');

    let left = 0;
    let top = 0;

    if (this.currentLetterIndex === 0) {
      const wordRect = currentWordEl.getBoundingClientRect();
      left = wordRect.left - containerRect.left;
      top = wordRect.top - containerRect.top + 4;
    } else if (this.currentLetterIndex <= letters.length) {
      const targetLetter = letters[this.currentLetterIndex - 1];
      const letterRect = targetLetter.getBoundingClientRect();
      left = letterRect.right - containerRect.left;
      top = letterRect.top - containerRect.top + 4;
    } else {
      const lastLetter = letters[letters.length - 1];
      const letterRect = lastLetter.getBoundingClientRect();
      left = letterRect.right - containerRect.left;
      top = letterRect.top - containerRect.top + 4;
    }

    this.caret.style.left = `${left}px`;
    this.caret.style.top = `${top}px`;
  }

  updateLiveHud() {
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    if (elapsedMinutes <= 0) return;

    // Real-time WPM: (correct characters / 5) / minutes
    const currentTypedCorrect = this.correctCharsCount;
    const liveWpm = Math.round((currentTypedCorrect / 5) / elapsedMinutes) || 0;
    
    const totalTyped = this.correctCharsCount + this.incorrectCharsCount + this.extraCharsCount;
    const liveAcc = totalTyped > 0 ? Math.round((this.correctCharsCount / totalTyped) * 100) : 100;

    this.hudWpm.textContent = liveWpm;
    this.hudAcc.textContent = `${liveAcc}%`;
  }

  recordPerformanceTick() {
    const elapsedSec = Math.round((Date.now() - this.startTime) / 1000);
    const elapsedMin = elapsedSec / 60;
    if (elapsedMin <= 0) return;

    const wpm = Math.round((this.correctCharsCount / 5) / elapsedMin) || 0;
    const totalTyped = this.correctCharsCount + this.incorrectCharsCount + this.extraCharsCount;
    const rawWpm = Math.round((totalTyped / 5) / elapsedMin) || 0;

    this.wpmHistory.push({
      sec: elapsedSec,
      wpm: wpm,
      raw: rawWpm,
      errors: this.incorrectCharsCount
    });
  }

  finishTest() {
    clearInterval(this.timerInterval);
    this.testActive = false;
    this.testFinished = true;

    // Process last word characters
    const currentWordEl = this.wordsContainer.children[this.currentWordIndex];
    if (currentWordEl) {
      const inputVal = this.typingInput.value;
      const originalWord = this.wordsList[this.currentWordIndex];
      for (let i = 0; i < inputVal.length; i++) {
        if (i < originalWord.length) {
          if (inputVal[i] === originalWord[i]) this.correctCharsCount++;
          else this.incorrectCharsCount++;
        } else {
          this.extraCharsCount++;
        }
      }
    }

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
    const elapsedMinutes = elapsedSeconds / 60;

    const finalWpm = Math.round((this.correctCharsCount / 5) / elapsedMinutes) || 0;
    const totalChars = this.correctCharsCount + this.incorrectCharsCount + this.extraCharsCount;
    const rawWpm = Math.round((totalChars / 5) / elapsedMinutes) || 0;
    const finalAccuracy = totalChars > 0 ? Math.round((this.correctCharsCount / totalChars) * 100) : 0;

    // Consistency score (standard deviation of recorded wpm)
    let consistency = 95;
    if (this.wpmHistory.length > 2) {
      const wpms = this.wpmHistory.map(h => h.wpm);
      const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(40, Math.min(100, Math.round(100 - (stdDev / (avg || 1)) * 100)));
    }

    // Rank & Title
    let rank = "Beginner Typer";
    let sub = "Terus berlatih untuk meningkatkan memori otot jari Anda!";
    if (finalWpm >= 110) {
      rank = "Godspeed Hacker ⚡";
      sub = "Kecepatan tingkat dewa! Anda adalah master keyboard sejati.";
    } else if (finalWpm >= 85) {
      rank = "Pro Typist 🚀";
      sub = "Sangat cepat dan konsisten! Cocok untuk coding kompetitif.";
    } else if (finalWpm >= 60) {
      rank = "Intermediate Fast ✨";
      sub = "Di atas rata-rata orang umum! Tingkatkan akurasi sedikit lagi.";
    } else if (finalWpm >= 40) {
      rank = "Steady Typer 🎯";
      sub = "Bagus dan stabil! Terus tingkatkan ritme mengetik tanpa melihat tombol.";
    }

    // Update Result UI
    this.performanceRank.textContent = rank;
    this.resultSubtitle.textContent = sub;
    this.resultWpm.textContent = finalWpm;
    this.resultRawWpm.textContent = `Raw: ${rawWpm} WPM`;
    this.resultAccuracy.textContent = `${finalAccuracy}%`;
    this.resultAccuracyDetails.textContent = `${this.incorrectCharsCount} salah / ${totalChars} total`;
    this.resultConsistency.textContent = `${consistency}%`;
    this.resultChars.textContent = `${this.correctCharsCount}/${this.incorrectCharsCount}/${this.extraCharsCount}/${this.missedCharsCount}`;

    // Save to LocalStorage
    this.saveResultToHistory({
      mode: `${this.primaryMode} ${this.subOption}`,
      wpm: finalWpm,
      raw: rawWpm,
      accuracy: finalAccuracy,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Render Chart
    this.renderResultChart();

    // Show Result Screen
    this.resultScreen.classList.remove('hidden');
  }

  saveResultToHistory(result) {
    const history = JSON.parse(localStorage.getItem('typo_history') || '[]');
    history.unshift(result);
    if (history.length > 50) history.pop();
    localStorage.setItem('typo_history', JSON.stringify(history));
  }

  renderResultChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Sample ticks if history is empty
    let labels = this.wpmHistory.map(h => `${h.sec}s`);
    let dataWpm = this.wpmHistory.map(h => h.wpm);
    let dataRaw = this.wpmHistory.map(h => h.raw);
    let dataErrors = this.wpmHistory.map(h => h.errors);

    if (labels.length === 0) {
      labels = ['1s', '2s', '3s'];
      dataWpm = [parseInt(this.resultWpm.textContent), parseInt(this.resultWpm.textContent), parseInt(this.resultWpm.textContent)];
      dataRaw = dataWpm;
      dataErrors = [0, 0, 0];
    }

    const computedStyle = getComputedStyle(document.documentElement);
    const accentColor = computedStyle.getPropertyValue('--accent').trim() || '#7aa2f7';
    const mutedColor = computedStyle.getPropertyValue('--text-muted').trim() || '#565f89';
    const errorColor = computedStyle.getPropertyValue('--error').trim() || '#f7768e';

    this.chartInstance = new Chart(this.chartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'WPM',
            data: dataWpm,
            borderColor: accentColor,
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: accentColor
          },
          {
            label: 'Raw WPM',
            data: dataRaw,
            borderColor: mutedColor,
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 0
          },
          {
            label: 'Errors',
            data: dataErrors,
            borderColor: errorColor,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: errorColor,
            yAxisID: 'y1',
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: mutedColor,
              font: { family: 'Outfit', size: 12 }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: mutedColor, font: { family: 'JetBrains Mono' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: mutedColor, font: { family: 'JetBrains Mono' } },
            beginAtZero: true
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: errorColor, precision: 0, beginAtZero: true }
          }
        }
      }
    });
  }

  updateStatsModalContent() {
    const history = JSON.parse(localStorage.getItem('typo_history') || '[]');
    const totalTestsEl = document.getElementById('statsTotalTests');
    const highestWpmEl = document.getElementById('statsHighestWpm');
    const avgWpmEl = document.getElementById('statsAvgWpm');
    const avgAccEl = document.getElementById('statsAvgAcc');
    const tableBody = document.getElementById('historyTableBody');

    if (history.length === 0) {
      totalTestsEl.textContent = '0';
      highestWpmEl.textContent = '0';
      avgWpmEl.textContent = '0';
      avgAccEl.textContent = '0%';
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Belum ada riwayat tes. Ketik sekarang!</td></tr>';
      return;
    }

    totalTestsEl.textContent = history.length;
    const maxWpm = Math.max(...history.map(h => h.wpm));
    const avgWpm = Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length);
    const avgAcc = Math.round(history.reduce((a, b) => a + b.accuracy, 0) / history.length);

    highestWpmEl.textContent = maxWpm;
    avgWpmEl.textContent = avgWpm;
    avgAccEl.textContent = `${avgAcc}%`;

    tableBody.innerHTML = '';
    history.slice(0, 10).forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="text-transform: capitalize;">${item.mode}</td>
        <td style="color: var(--accent); font-weight: bold;">${item.wpm}</td>
        <td>${item.raw}</td>
        <td>${item.accuracy}%</td>
        <td>${item.timestamp}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  copyResultsToClipboard() {
    const text = `🚀 TypoVerse Speed Test Result:\nWPM: ${this.resultWpm.textContent} | Akurasi: ${this.resultAccuracy.textContent} | Mode: ${this.primaryMode} (${this.subOption})\nRank: ${this.performanceRank.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
      const originalText = this.copyResultBtn.innerHTML;
      this.copyResultBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
      setTimeout(() => {
        this.copyResultBtn.innerHTML = originalText;
      }, 2000);
    });
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TypoVerseApp();
});
