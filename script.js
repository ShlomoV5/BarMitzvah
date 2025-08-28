(function () {
  /** Controller with on-demand aliyah loading + per-pasuk steps, floating controls,
   *  and "last 3 did-well => green" rule for progress bar.
   */

  // Splash handling
  const splashEl = document.getElementById("splash");
  const setLoaded = () => {
    document.documentElement.classList.remove("loading");
    if (splashEl) {
      splashEl.classList.add("hidden");
      setTimeout(() => splashEl.remove(), 300);
    }
  };

  // DOM
  const progressBarContainer = document.getElementById("progressBar");
  const titleElement = document.getElementById("pasukTitle");
  const pasukTextElement = document.getElementById("pasukText");
  const audioElement = document.getElementById("pasukAudio");
  const audioSourceElement = document.getElementById("audioSource");
  const pointsSpan = document.getElementById("points");
  const didWellButton = document.getElementById("didWell");
  const needPracticeButton = document.getElementById("needPractice");
  const feedbackDiv = document.getElementById("feedback");
  const practiceLogBody = document.getElementById("practiceLogBody");
  const tryAgainStepBtn = document.getElementById("tryAgainStep");
  // player elements
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const playerSeek = document.getElementById('playerSeek');
  const curTimeSpan = document.getElementById('curTime');
  const durTimeSpan = document.getElementById('durTime');
  const progressBack = document.getElementById('progressBack');
  const progressNext = document.getElementById('progressNext');
  const leftMenu = document.querySelector(".left-menu");
  const practiceLogFloat = document.getElementById("practiceLogFloat");
  const practiceLogHandle = document.getElementById("practiceLogHandle");
  const leftMenuHandle = document.getElementById("leftMenuHandle");
  const menuClose = document.querySelector('#leftMenu .menu-close');
  const practiceLogClose = document.querySelector('#practiceLogFloat .log-close');

  // Ensure expandables default state depends on viewport: collapsed on small screens, expanded on desktop
  const isMobile = window.innerWidth <= 700;
  if (leftMenu) {
    if (isMobile) {
      leftMenu.classList.remove("expanded");
      leftMenu.setAttribute("aria-hidden", "true");
    } else {
      leftMenu.classList.add("expanded");
      leftMenu.setAttribute("aria-hidden", "false");
    }
  }
  if (practiceLogFloat) {
    if (isMobile) {
      practiceLogFloat.classList.remove("expanded");
      practiceLogFloat.setAttribute("aria-hidden", "true");
    } else {
      practiceLogFloat.classList.add("expanded");
      practiceLogFloat.setAttribute("aria-hidden", "false");
    }
  }

  // Left menu toggle (mobile): toggle .expanded on the aside
  if (leftMenuHandle && leftMenu) {
    leftMenuHandle.addEventListener("click", (e) => {
      const isExpanded = leftMenu.classList.contains("expanded");
      if (isExpanded) {
        leftMenu.classList.remove("expanded");
        leftMenu.setAttribute("aria-hidden", "true");
      } else {
        leftMenu.classList.add("expanded");
        leftMenu.setAttribute("aria-hidden", "false");
      }
    });
  }

  // Menu close (✕) — collapse when clicked
  if (menuClose && leftMenu) {
    menuClose.addEventListener('click', (e) => {
      e.stopPropagation();
      leftMenu.classList.remove('expanded');
      leftMenu.setAttribute('aria-hidden', 'true');
    });
  }

  // Practice log toggle (mobile)
  if (practiceLogHandle && practiceLogFloat) {
    practiceLogHandle.addEventListener("click", () => {
      const isExpanded = practiceLogFloat.classList.contains("expanded");
      if (isExpanded) {
        practiceLogFloat.classList.remove("expanded");
        practiceLogFloat.setAttribute("aria-hidden", "true");
      } else {
        practiceLogFloat.classList.add("expanded");
        practiceLogFloat.setAttribute("aria-hidden", "false");
      }
    });
  }

  // Practice log close (✕)
  if (practiceLogClose && practiceLogFloat) {
    practiceLogClose.addEventListener('click', (e) => {
      e.stopPropagation();
      practiceLogFloat.classList.remove('expanded');
      practiceLogFloat.setAttribute('aria-hidden', 'true');
    });
  }

  // State
  let aliyahKey = null; // e.g., "rishon"
  let pasukSets = []; // [{pasukNumber, steps:[...]}, ...]
  let flatSteps = []; // flattened steps for simple navigation
  let totalPesukim = 0;
  let currentIndex = 0;

  // Persistent stores (scoped by aliyahKey)
  let sessionAttemptsPerIndex = []; // per-step attempts (session only)
  let stepScores = []; // persistent per-step best (0..3)
  let pasukScoresFull = []; // best full-pasuk per pasuk (0..3)
  let practiceData = {};
  let recentPasukOutcomes = []; // per pasuk array of last outcomes (deque of booleans, length<=3)
  const todayKey = new Date().toISOString().split("T")[0];

  // Helpers to get/set localStorage keys namespaced by aliyah
  const keyPrefix = () => (aliyahKey ? `bm_${aliyahKey}_` : "bm_");
  const LS = {
    practice: () => `${keyPrefix()}practice`,
    stepScores: () => `${keyPrefix()}step_scores`,
    fullScores: () => `${keyPrefix()}full_scores`,
    recent: () => `${keyPrefix()}recent_outcomes`,
  };

  /** ========== DATA LOADING ========== */
  async function loadAliyah(key) {
    aliyahKey = key; // e.g., "rishon"
    if (key === "rishon") {
      // Dynamic import to load only when "on it"
      const mod = await import("./aliyah1.js");
      pasukSets = mod.default;
    } else {
      // Future: different aliyot can be added similarly
      pasukSets = [];
    }

    totalPesukim = pasukSets.length;

    // Flatten steps
    flatSteps = [];
    pasukSets.forEach((p) => {
      p.steps.forEach((s, idx) => {
        flatSteps.push({
          ...s,
          pasukNumber: p.pasukNumber,
          partIndex: idx,
          partsCount: p.steps.length,
        });
      });
    });

    // Initialize stores based on flat length
    sessionAttemptsPerIndex = new Array(flatSteps.length).fill(0);
    stepScores = loadStepScores();
    if (stepScores.length !== flatSteps.length)
      stepScores = new Array(flatSteps.length).fill(0);

    pasukScoresFull = loadFullPasukScores();
    if (pasukScoresFull.length !== totalPesukim)
      pasukScoresFull = new Array(totalPesukim).fill(0);

    recentPasukOutcomes = loadRecentOutcomes();
    if (recentPasukOutcomes.length !== totalPesukim)
      recentPasukOutcomes = Array.from({ length: totalPesukim }, () => []);

    practiceData = getPracticeData();

    // UI
    createProgressBar();
    currentIndex = 0;
    renderStep(currentIndex);
    renderFloatingPracticeLog();
    startActiveTimeTracker();
    setLoaded();
  }

  /** ========== STORAGE ========== */
  function getPracticeData() {
    const data = localStorage.getItem(LS.practice());
    return data ? JSON.parse(data) : {};
  }
  function savePracticeData() {
    localStorage.setItem(LS.practice(), JSON.stringify(practiceData));
  }
  function loadStepScores() {
    const s = localStorage.getItem(LS.stepScores());
    return s ? JSON.parse(s) : [];
  }
  function saveStepScores() {
    localStorage.setItem(LS.stepScores(), JSON.stringify(stepScores));
  }
  function loadFullPasukScores() {
    const s = localStorage.getItem(LS.fullScores());
    return s ? JSON.parse(s) : [];
  }
  function saveFullPasukScores() {
    localStorage.setItem(LS.fullScores(), JSON.stringify(pasukScoresFull));
  }
  function loadRecentOutcomes() {
    const s = localStorage.getItem(LS.recent());
    return s ? JSON.parse(s) : [];
  }
  function saveRecentOutcomes() {
    localStorage.setItem(LS.recent(), JSON.stringify(recentPasukOutcomes));
  }

  /** ========== PROGRESS BAR ========== */
  function createProgressBar() {
    progressBarContainer.innerHTML = "";
    for (let i = 0; i < totalPesukim; i++) {
      const blk = document.createElement("div");
      blk.className = "progress-block pb-gray";
      const fill = document.createElement("div");
      fill.className = "fill";
      blk.appendChild(fill);
      progressBarContainer.appendChild(blk);
    }
    redrawProgressBar();
  }

  // Compute fraction using either best full score or average of parts (from stepScores)
  function computePasukFraction(pasukIdx) {
    const pasukNumber = pasukIdx + 1;
    const pasuk = pasukSets[pasukIdx];
    let fullFrac = 0;
    let partFrac = 0;

    // best full score for pasuk
    const fullScore = pasukScoresFull[pasukIdx] || 0;
    fullFrac = fullScore / 3;

    // parts average from stepScores
    const stepIndices = getStepIndicesOfPasuk(pasukNumber);
    if (stepIndices.length > 0) {
      let sum = 0;
      let count = 0;
      stepIndices.forEach((si) => {
        sum += stepScores[si] || 0;
        count++;
      });
      partFrac = count ? sum / (3 * count) : 0;
    }

    return Math.max(fullFrac, partFrac);
  }

  function isPasukGreen(pasukIdx) {
    // Green only if last 3 outcomes for this pasuk are true (i.e., 3 consecutive "did well")
    const recent = recentPasukOutcomes[pasukIdx] || [];
    if (recent.length < 3) return false;
    return recent.slice(-3).every(Boolean);
  }

  function redrawProgressBar() {
    const blocks = Array.from(progressBarContainer.children);
    blocks.forEach((blk, i) => {
      const frac = computePasukFraction(i); // 0..1
      const fill = blk.querySelector(".fill");
      fill.style.width = `${Math.round(frac * 100)}%`;

      // base class reset
      blk.classList.remove("pb-gray", "pb-yellow", "pb-green", "current");
      // color logic
      if (frac <= 0) {
        blk.classList.add("pb-gray");
      } else {
        if (isPasukGreen(i)) blk.classList.add("pb-green");
        else blk.classList.add("pb-yellow");
      }
    });

    // Mark current pasuk + label chunk
    const current = flatSteps[currentIndex];
    if (!current) return;
    const pasukBlock = blocks[current.pasukNumber - 1];
    if (pasukBlock) pasukBlock.classList.add("current");

    // Update arrow enable/disable
    if (progressBack) progressBack.disabled = currentIndex === 0;
    if (progressNext) progressNext.disabled = currentIndex >= flatSteps.length - 1;

    // Wire click-to-jump for blocks (one-time attach)
    blocks.forEach((b, idx) => {
      if (!b.dataset.bound) {
        b.addEventListener('click', () => {
          // jump to first step of pasuk idx+1
          const pasukNum = idx + 1;
          const stepIndices = getStepIndicesOfPasuk(pasukNum);
          if (stepIndices && stepIndices.length) {
            currentIndex = stepIndices[0];
            renderStep(currentIndex);
          }
        });
        b.dataset.bound = '1';
      }
    });
  }

  function getStepIndicesOfPasuk(pasukNumber) {
    const indices = [];
    flatSteps.forEach((s, idx) => {
      if (s.pasukNumber === pasukNumber) indices.push(idx);
    });
    return indices;
  }

  /** ========== PRACTICE LOG (FLOATING) ========== */
  function formatSeconds(totalSeconds) {
    if (!totalSeconds) return "0s";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = minutes > 0 ? `${minutes}m ` : "";
    const ss = `${seconds}s`;
    return (mm + ss).trim();
  }

  function renderFloatingPracticeLog() {
    practiceLogBody.innerHTML = "";
    const today = new Date();

    // last 14 days
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d);
    }

    const rows = days.map((date) => {
      const key = date.toISOString().split("T")[0];
      const rec = practiceData[key];
      const dateStr = date.toLocaleDateString(undefined, {
        month: "2-digit",
        day: "2-digit",
      });
      return {
        key,
        dateStr,
        points: rec?.points || 0,
        secs: rec?.activeSeconds || 0,
      };
    });

    let startIdx = rows.findIndex((r) => r.points > 0 || r.secs > 0);
    if (startIdx === -1) return;

    rows.slice(startIdx).forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.dateStr}</td><td>${
        r.points
      }</td><td>${formatSeconds(r.secs)}</td>`;
      practiceLogBody.appendChild(tr);
    });
  }

  function startActiveTimeTracker() {
    setInterval(() => {
      if (!document.hidden) {
        const todayData = practiceData[todayKey] || {
          points: 0,
          activeSeconds: 0,
        };
        todayData.activeSeconds = (todayData.activeSeconds || 0) + 1;
        practiceData[todayKey] = todayData;
        if (todayData.activeSeconds % 5 === 0) {
          savePracticeData();
          renderFloatingPracticeLog();
        }
      }
    }, 1000);

    window.addEventListener("beforeunload", () => {
      savePracticeData();
      saveStepScores();
      saveFullPasukScores();
      saveRecentOutcomes();
    });
  }

  /** ========== RENDER / FEEDBACK ========== */
  function renderStep(index) {
    const step = flatSteps[index];
    if (!step) return;
  titleElement.textContent = step.title;
  // update the small header to show current chunk/step name
  const currentLearning = document.getElementById('currentLearning');
  if (currentLearning) currentLearning.textContent = `Currently learning: ${step.title}`;
  // show aliyah label (static for now)
  const aliyahLabelEl = document.getElementById('aliyahLabel');
  if (aliyahLabelEl) aliyahLabelEl.textContent = `Aliyah: ראשון`;
    pasukTextElement.textContent = step.text;
    audioSourceElement.src = step.audio;
    audioElement.load();
    showFeedback("", "");
  // end-of-aliyah UI removed; nothing to show here
    redrawProgressBar();
    // Auto-size the pasuk to fill available vertical space
    requestAnimationFrame(autoSizePasuk);
  }

  // Auto-size algorithm: binary search the largest font-size (px) that keeps
  // the pasuk's scrollHeight within the available space left in .container.
  function autoSizePasuk() {
    if (!pasukTextElement) return;
    const container = document.querySelector('.container');
    if (!container) return;

    // Reset to a reasonable starting point so measurements start fresh
  const MIN = 12;
  const MAX = (window.innerWidth > 700) ? 30 : 160; // cap at 30px on desktop

    // Compute the vertical space used by siblings (everything in container except pasuk)
    const siblings = Array.from(container.children).filter(c => c !== pasukTextElement);
    let siblingsHeight = 0;
    siblings.forEach((s) => {
      // Use offsetHeight which is reliable for visible elements
      siblingsHeight += s.offsetHeight || 0;
    });

    // reserve a small gap
    const reserved = 8; // px
    const available = Math.max(40, container.clientHeight - siblingsHeight - reserved);

    // Binary search for best font size
    let low = MIN, high = MAX, best = MIN;
    // ensure word-wrapping is normal for accurate height
    pasukTextElement.style.whiteSpace = 'normal';
    pasukTextElement.style.overflow = 'visible';

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      pasukTextElement.style.fontSize = mid + 'px';
      // force layout
      const needed = pasukTextElement.scrollHeight;
      if (needed <= available) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    pasukTextElement.style.fontSize = best + 'px';
    // Keep overflow hidden so there is no internal scroll
    pasukTextElement.style.overflow = 'hidden';
  }

  // Re-run autosize on resizes and when container layout changes
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => requestAnimationFrame(autoSizePasuk), 120);
  });

  // Observe container size changes (for dynamic UI on mobile toggles)
  try {
    const containerEl = document.querySelector('.container');
    if (containerEl && window.ResizeObserver) {
      const ro = new ResizeObserver(() => requestAnimationFrame(autoSizePasuk));
      ro.observe(containerEl);
    }
  } catch (e) {
    // ignore if ResizeObserver not available
  }

  function showFeedback(msg, type) {
    feedbackDiv.textContent = msg;
    feedbackDiv.className = `feedback ${type || ""}`;
  }

  /** ========== SCORING & OUTCOMES ========== */
  function pointsFromAttempts(attempts) {
    if (attempts === 1) return 3;
    if (attempts === 2) return 2;
    return 1;
  }

  function updateDailyPoints(index) {
    sessionAttemptsPerIndex[index]++;
    const p = pointsFromAttempts(sessionAttemptsPerIndex[index]);
    const todayData = practiceData[todayKey] || { points: 0, activeSeconds: 0 };
    todayData.points = (todayData.points || 0) + p;
    practiceData[todayKey] = todayData;
    pointsSpan.textContent = todayData.points;
    savePracticeData();
    renderFloatingPracticeLog();
    return p;
  }

  function updateStepScore(stepIdx) {
    const attempts = sessionAttemptsPerIndex[stepIdx];
    const earned = pointsFromAttempts(attempts); // 3/2/1
    stepScores[stepIdx] = Math.max(stepScores[stepIdx], earned);

    const step = flatSteps[stepIdx];
    if (step.isFullPasuk) {
      const pIdx = step.pasukNumber - 1;
      pasukScoresFull[pIdx] = Math.max(pasukScoresFull[pIdx], earned);
    }
    saveStepScores();
    saveFullPasukScores();
  }

  function recordPasukOutcome(pasukIdx, didWell) {
    const q = recentPasukOutcomes[pasukIdx] || [];
    q.push(!!didWell);
    // keep last 3 only
    while (q.length > 3) q.shift();
    recentPasukOutcomes[pasukIdx] = q;
    saveRecentOutcomes();
  }

  /** ========== BUTTONS ========== */
  didWellButton.addEventListener("click", function () {
    const step = flatSteps[currentIndex];
    const pasukIdx = step.pasukNumber - 1;

    updateDailyPoints(currentIndex);
    updateStepScore(currentIndex);
    recordPasukOutcome(pasukIdx, true);
    redrawProgressBar();

    // Advance
    currentIndex++;
    if (currentIndex < flatSteps.length) {
      showFeedback("Great job! Moving on to the next part.", "success");
      renderStep(currentIndex);
    } else {
      showFeedback("You finished this Aliyah.", "success");
      // confetti remains
      confetti({ particleCount: 220, spread: 100, origin: { y: 0.6 } });
    }
  });

  needPracticeButton.addEventListener("click", function () {
    const step = flatSteps[currentIndex];
    const pasukIdx = step.pasukNumber - 1;

    sessionAttemptsPerIndex[currentIndex]++;
    recordPasukOutcome(pasukIdx, false);
    redrawProgressBar();

    showFeedback(
      "Excellent! A bit more practice and it will be perfect.",
      "practice"
    );
  });

  if (tryAgainStepBtn) {
    tryAgainStepBtn.addEventListener("click", function () {
      sessionAttemptsPerIndex[currentIndex] = 0; // allow fresh scoring for daily points
      audioElement.currentTime = 0;
      audioElement.play().catch(() => {});
      showFeedback("Repeating this part.", "");
    });
  }

  // end-of-aliyah UI removed from markup; nothing to remove here

  // Player wiring
  if (playBtn && audioElement) {
    playBtn.addEventListener('click', () => {
      audioElement.play().catch(()=>{});
    });
  }
  if (pauseBtn && audioElement) {
    pauseBtn.addEventListener('click', () => {
      audioElement.pause();
    });
  }
  if (playerSeek && audioElement) {
    playerSeek.addEventListener('input', () => {
      const pct = playerSeek.value / 100;
      if (audioElement.duration) audioElement.currentTime = pct * audioElement.duration;
    });
  }
  // Sync timeline
  audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration && playerSeek) {
      const pct = (audioElement.currentTime / audioElement.duration) * 100;
      playerSeek.value = pct;
      if (curTimeSpan) curTimeSpan.textContent = formatTime(audioElement.currentTime);
      if (durTimeSpan) durTimeSpan.textContent = formatTime(audioElement.duration);
    }
  });
  audioElement.addEventListener('loadedmetadata', () => {
    if (durTimeSpan) durTimeSpan.textContent = formatTime(audioElement.duration || 0);
  });

  function formatTime(secs) {
    if (!secs || isNaN(secs)) return '0:00';
    const s = Math.floor(secs % 60).toString().padStart(2,'0');
    const m = Math.floor(secs / 60);
    return `${m}:${s}`;
  }

  // Progress arrows
  if (progressBack) {
    progressBack.addEventListener('click', () => {
      if (currentIndex > 0) { currentIndex--; renderStep(currentIndex); }
    });
  }
  if (progressNext) {
    progressNext.addEventListener('click', () => {
      if (currentIndex < flatSteps.length - 1) { currentIndex++; renderStep(currentIndex); }
    });
  }

  /** ========== MENU HANDLING (Aliyah selection) ========== */
  if (leftMenu) {
    leftMenu.addEventListener("click", (e) => {
      const btn = e.target.closest(".menu-btn[data-aliyah]");
      if (!btn || btn.disabled) return;

      document
        .querySelectorAll(".menu-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.getAttribute("data-aliyah"); // e.g., "rishon"
      // Re-load data & reset state for the chosen aliyah
      loadAliyah(key);
    });
  }

  /** ========== INIT (default to rishon) ========== */
  (async function initialize() {
    // Load Rishon on start (matches your current UI)
    await loadAliyah("rishon");

    const todayData = practiceData[todayKey] || { points: 0, activeSeconds: 0 };
    pointsSpan.textContent = todayData.points;

    // Mark loaded if not already
    setLoaded();
  })();
})();
