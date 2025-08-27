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
  const endAliyahControls = document.getElementById("endAliyahControls");
  const tryAgainAliyahBtn = document.getElementById("tryAgainAliyah");
  const leftMenu = document.querySelector(".left-menu");
  const practiceLogFloat = document.getElementById("practiceLogFloat");
  const practiceLogHandle = document.getElementById("practiceLogHandle");
  const leftMenuHandle = document.getElementById("leftMenuHandle");

  // Ensure expandables start closed by default
  if (leftMenu) {
    leftMenu.classList.remove("expanded");
    leftMenu.setAttribute("aria-hidden", "true");
  }
  if (practiceLogFloat) {
    practiceLogFloat.classList.remove("expanded");
    practiceLogFloat.setAttribute("aria-hidden", "true");
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
    if (pasukBlock) {
      pasukBlock.classList.add("current");

      // Ensure only one label exists
      blocks.forEach((b) => {
        const lbl = b.querySelector(".current-label");
        if (lbl) lbl.remove();
      });

      const label = document.createElement("div");
      label.className = "current-label";
      const partIdx = current.partIndex + 1;
      label.textContent = `Now ${current.pasukNumber}:${partIdx}/${current.partsCount}`;
      pasukBlock.appendChild(label);
    }
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
    pasukTextElement.textContent = step.text;
    audioSourceElement.src = step.audio;
    audioElement.load();
    showFeedback("", "");
    endAliyahControls.hidden = true;
    redrawProgressBar();
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
      endAliyahControls.hidden = false;
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

  tryAgainStepBtn.addEventListener("click", function () {
    sessionAttemptsPerIndex[currentIndex] = 0; // allow fresh scoring for daily points
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {});
    showFeedback("Repeating this part.", "");
  });

  tryAgainAliyahBtn.addEventListener("click", function () {
    sessionAttemptsPerIndex = new Array(flatSteps.length).fill(0);
    currentIndex = 0;
    endAliyahControls.hidden = true;
    showFeedback("The Aliyah has restarted.", "");
    renderStep(currentIndex);
  });

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
