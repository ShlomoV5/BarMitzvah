(function () {
  /**
   * ENHANCEMENTS:
   * 1) Splash screen: show until init completes (then unblur UI).
   * 2) Partial progress contribution:
   *    - Each pasuk (1..12) has a single block.
   *    - Progress fraction for a pasuk is the MAX of:
   *        a) full pasuk score / 3,
   *        b) (sum of part-scores) / (3 * number_of_parts)
   *    - Part-scores and full-score are 0..3 per step, derived from attempts.
   */

  const splashEl = document.getElementById("splash");
  const setLoaded = () => {
    document.documentElement.classList.remove("loading");
    splashEl.classList.add("hidden");
    // remove from DOM later to free events
    setTimeout(() => splashEl.remove(), 300);
  };

  const pesukim = [
    // Pasuk 1 (Bereshit 28:10)
    {
      title: "Bereshit 28:10",
      text: "וַיֵּצֵ֥א יַעֲקֹ֖ב מִבְּאֵ֣ר שָׁ֑בַע וַיֵּ֖לֶךְ חָרָֽנָה",
      audio: "ויצא1.mp3",
      isFullPasuk: true,
      pasukNumber: 1,
    },
    // Pasuk 2 (Bereshit 28:11) - Parts
    {
      title: "Bereshit 28:11 - Part 1",
      text: "וַיִּפְגַּ֨ע בַּמָּק֜וֹם וַיָּ֤לֶן שָׁ֙ם֙ כִּי־בָ֣א הַשֶּׁ֔מֶשׁ",
      audio: "ויצא2א.mp3",
      isFullPasuk: false,
      pasukNumber: 2,
    },
    {
      title: "Bereshit 28:11 - Part 2",
      text: "וַיִּקַּח֙ מֵאַבְנֵ֣י הַמָּק֔וֹם וַיָּ֖שֶׂם מְרַֽאֲשֹׁתָ֑יו",
      audio: "ויצא2ב.mp3",
      isFullPasuk: false,
      pasukNumber: 2,
    },
    {
      title: "Bereshit 28:11 - Part 3",
      text: "וַיִּשְׁכַּ֖ב בַּמָּק֥וֹם הַהֽוּא׃",
      audio: "ויצא2ג.mp3",
      isFullPasuk: false,
      pasukNumber: 2,
    },
    {
      title: "Bereshit 28:11 - Full Pasuk",
      text: "וַיִּפְגַּ֨ע בַּמָּק֜וֹם וַיָּ֤לֶן שָׁ֙ם֙ כִּי־בָ֣א הַשֶּׁ֔מֶשׁ וַיִּקַּח֙ מֵאַבְנֵ֣י הַמָּק֔וֹם וַיָּ֖שֶׂם מְרַֽאֲשֹׁתָ֑יו וַיִּשְׁכַּ֖ב בַּמָּק֥וֹם הַהֽוּא׃",
      audio: "ויצא2.mp3",
      isFullPasuk: true,
      pasukNumber: 2,
    },
    // Pasuk 3 (Bereshit 28:12) - Parts
    {
      title: "Bereshit 28:12 - Part 1",
      text: "וַֽיַּחֲלֹ֗ם וְהִנֵּ֤ה סֻלָּם֙ מֻצָּ֣ב אַ֔רְצָה וְרֹאשׁ֖וֹ מַגִּ֣יעַ הַשָּׁמָ֑יְמָה",
      audio: "ויצא3א.mp3",
      isFullPasuk: false,
      pasukNumber: 3,
    },
    {
      title: "Bereshit 28:12 - Part 2",
      text: "וְהִנֵּה֙ מַלְאֲכֵ֣י אֱלֹהִ֔ים עֹלִ֥ים וְיֹרְדִ֖ים בּֽוֹ׃",
      audio: "ויצא3ב.mp3",
      isFullPasuk: false,
      pasukNumber: 3,
    },
    {
      title: "Bereshit 28:12 - Full Pasuk",
      text: "וַֽיַּחֲלֹ֗ם וְהִנֵּ֤ה סֻלָּם֙ מֻצָּ֣ב אַ֔רְצָה וְרֹאשׁ֖וֹ מַגִּ֣יעַ הַשָּׁמָ֑יְמָה וְהִנֵּה֙ מַלְאֲכֵ֣י אֱלֹהִ֔ים עֹלִ֥ים וְיֹרְדִ֖ים בּֽוֹ׃",
      audio: "ויצא3.mp3",
      isFullPasuk: true,
      pasukNumber: 3,
    },
    // Pasuk 4 (Bereshit 28:13) - Parts
    {
      title: "Bereshit 28:13 - Part 1",
      text: "וְהִנֵּ֨ה יְהֹוָ֜ה נִצָּ֣ב עָלָיו֮ וַיֹּאמַר֒",
      audio: "ויצא4א.mp3",
      isFullPasuk: false,
      pasukNumber: 4,
    },
    {
      title: "Bereshit 28:13 - Part 2",
      text: "אֲנִ֣י יְהֹוָ֗ה אֱלֹהֵי֙ אַבְרָהָ֣ם אָבִ֔יךָ וֵאלֹהֵ֖י יִצְחָ֑ק",
      audio: "ויצא4ב.mp3",
      isFullPasuk: false,
      pasukNumber: 4,
    },
    {
      title: "Bereshit 28:13 - Part 3",
      text: "הָאָ֗רֶץ אֲשֶׁ֤ר אַתָּה֙ שֹׁכֵ֣ב עָלֶ֔יהָ לְךָ֥ אֶתְּנֶ֖נָּה וּלְזַרְעֶֽךָ׃",
      audio: "ויצא4ג.mp3",
      isFullPasuk: false,
      pasukNumber: 4,
    },
    {
      title: "Bereshit 28:13 - Full Pasuk",
      text: "וְהִנֵּ֨ה יְהֹוָ֜ה נִצָּ֣ב עָלָיו֮ וַיֹּאמַר֒ אֲנִ֣י יְהֹוָ֗ה אֱלֹהֵי֙ אַבְרָהָ֣ם אָבִ֔יךָ וֵאלֹהֵ֖י יִצְחָ֑ק הָאָ֗רֶץ אֲשֶׁ֤ר אַתָּה֙ שֹׁכֵ֣ב עָלֶ֔יהָ לְךָ֥ אֶתְּנֶ֖נָּה וּלְזַרְעֶֽךָ׃",
      audio: "ויצא4.mp3",
      isFullPasuk: true,
      pasukNumber: 4,
    },
    // Pasuk 5 (Bereshit 28:14) - Parts
    {
      title: "Bereshit 28:14 - Part 1",
      text: "וְהָיָ֤ה זַרְעֲךָ֙ כַּעֲפַ֣ר הָאָ֔רֶץ וּפָרַצְתָּ֛ יָ֥מָּה וָקֵ֖דְמָה וְצָפֹ֣נָה וָנֶ֑גְבָּה",
      audio: "ויצא5א.mp3",
      isFullPasuk: false,
      pasukNumber: 5,
    },
    {
      title: "Bereshit 28:14 - Part 2",
      text: "וְנִבְרְﬞכ֥וּ בְךָ֛ כׇּל־מִשְׁפְּחֹ֥ת הָאֲדָמָ֖ה וּבְזַרְעֶֽךָ׃",
      audio: "ויצא5ב.mp3",
      isFullPasuk: false,
      pasukNumber: 5,
    },
    {
      title: "Bereshit 28:14 - Full Pasuk",
      text: "וְהָיָ֤ה זַרְעֲךָ֙ כַּעֲפַ֣ר הָאָ֔רֶץ וּפָרַצְתָּ֛ יָ֥מָּה וָקֵ֖דְמָה וְצָפֹ֣נָה וָנֶ֑גְבָּה וְנִבְרְﬞכ֥וּ בְךָ֛ כׇּל־מִשְׁפְּחֹ֥ת הָאֲדָמָ֖ה וּבְזַרְעֶֽךָ׃",
      audio: "ויצא5.mp3",
      isFullPasuk: true,
      pasukNumber: 5,
    },

    // Pasuk 6 (Bereshit 28:15) - Parts
    {
      title: "Bereshit 28:15 - Part 1",
      text: "וְהִנֵּ֨ה אָנֹכִ֜י עִמָּ֗ךְ",
      audio: "ויצא6א.mp3",
      isFullPasuk: false,
      pasukNumber: 6,
    },
    {
      title: "Bereshit 28:15 - Part 2",
      text: "וּשְׁמַרְתִּ֙יךָ֙ בְּכֹ֣ל אֲשֶׁר־תֵּלֵ֔ךְ וַהֲשִׁ֣בֹתִ֔יךָ אֶל־הָאֲדָמָ֖ה הַזֹּ֑את",
      audio: "ויצא6ב.mp3",
      isFullPasuk: false,
      pasukNumber: 6,
    },
    {
      title: "Bereshit 28:15 - Part 3",
      text: "כִּ֚י לֹ֣א אֶֽעֱזׇבְךָ֔ עַ֚ד אֲשֶׁ֣ר אִם־עָשִׂ֔יתִי אֵ֥ת אֲשֶׁר־דִּבַּ֖רְתִּי לָֽךְ׃",
      audio: "ויצא6ג.mp3",
      isFullPasuk: false,
      pasukNumber: 6,
    },
    {
      title: "Bereshit 28:15 - Full Pasuk",
      text: "וְהִנֵּ֨ה אָנֹכִ֜י עִמָּ֗ךְ וּשְׁמַרְתִּ֙יךָ֙ בְּכֹ֣ל אֲשֶׁר־תֵּלֵ֔ךְ וַהֲשִׁ֣בֹתִ֔יךָ אֶל־הָאֲדָמָ֖ה הַזֹּ֑את כִּ֚י לֹ֣א אֶֽעֱזׇבְךָ֔ עַ֚ד אֲשֶׁ֣ר אִם־עָשִׂ֔יתִי אֵ֥ת אֲשֶׁר־דִּבַּ֖רְתִּי לָֽךְ׃",
      audio: "ויצא6.mp3",
      isFullPasuk: true,
      pasukNumber: 6,
    },

    // Pasuk 7 (Bereshit 28:16) - Single
    {
      title: "Bereshit 28:16",
      text: "וַיִּיקַ֣ץ יַעֲקֹב֮ מִשְּׁנָתוֹ֒ וַיֹּ֕אמֶר אָכֵן֙ יֵ֣שׁ יְהֹוָ֔ה בַּמָּק֖וֹם הַזֶּ֑ה וְאָנֹכִ֖י לֹ֥א יָדָֽעְתִּי׃",
      audio: "ויצא7.mp3",
      isFullPasuk: true,
      pasukNumber: 7,
    },

    // Pasuk 8 (Bereshit 28:17) - Parts
    {
      title: "Bereshit 28:17 - Part 1",
      text: "וַיִּירָא֙ וַיֹּאמַ֔ר מַה־נּוֹרָ֖א הַמָּק֣וֹם הַזֶּ֑ה",
      audio: "ויצא8א.mp3",
      isFullPasuk: false,
      pasukNumber: 8,
    },
    {
      title: "Bereshit 28:17 - Part 2",
      text: "אֵ֣ין זֶ֗ה כִּ֚י אִם־בֵּ֣ית אֱלֹהִ֔ים וְזֶ֖ה שַׁ֥עַר הַשָּׁמָֽיִם׃",
      audio: "ויצא8ב.mp3",
      isFullPasuk: false,
      pasukNumber: 8,
    },
    {
      title: "Bereshit 28:17 - Full Pasuk",
      text: "וַיִּירָא֙ וַיֹּאמַ֔ר מַה־נּוֹרָ֖א הַמָּק֣וֹם הַזֶּ֑ה אֵ֣ין זֶ֗ה כִּ֚י אִם־בֵּ֣ית אֱלֹהִ֔ים וְזֶ֖ה שַׁ֥עַר הַשָּׁמָֽיִם׃",
      audio: "ויצא8.mp3",
      isFullPasuk: true,
      pasukNumber: 8,
    },
    // Pasuk 9 (Bereshit 28:18) - Parts
    {
      title: "Bereshit 28:18 - Part 1",
      text: "וַיַּשְׁכֵּ֨ם יַעֲקֹ֜ב בַּבֹּ֗קֶר",
      audio: "ויצא9א.mp3",
      isFullPasuk: false,
      pasukNumber: 9,
    },
    {
      title: "Bereshit 28:18 - Part 2",
      text: "וַיִּקַּ֤ח אֶת־הָאֶ֙בֶן֙ אֲשֶׁר־שָׂ֣ם מְרַֽאֲשֹׁתָ֔יו",
      audio: "ויצא9ב.mp3",
      isFullPasuk: false,
      pasukNumber: 9,
    },
    {
      title: "Bereshit 28:18 - Part 3",
      text: "וַיָּ֥שֶׂם אֹתָ֖הּ מַצֵּבָ֑ה וַיִּצֹ֥ק שֶׁ֖מֶן עַל־רֹאשָֽׁהּ",
      audio: "ויצא9ג.mp3",
      isFullPasuk: false,
      pasukNumber: 9,
    },
    {
      title: "Bereshit 28:18 - Full Pasuk",
      text: "וַיַּשְׁכֵּ֨ם יַעֲקֹ֜ב בַּבֹּ֗קֶר וַיִּקַּ֤ח אֶת־הָאֶ֙בֶן֙ אֲשֶׁר־שָׂ֣ם מְרַֽאֲשֹׁתָ֔יו וַיָּ֥שֶׂם אֹתָ֖הּ מַצֵּבָ֑ה וַיִּצֹ֥ק שֶׁ֖מֶן עַל־רֹאשָֽׁהּ",
      audio: "ויצא9.mp3",
      isFullPasuk: true,
      pasukNumber: 9,
    },

    // Pasuk 10 (Bereshit 28:19) - Single
    {
      title: "Bereshit 28:19",
      text: "וַיִּקְרָ֛א אֶת־שֵֽׁם־הַמָּק֥וֹם הַה֖וּא בֵּֽית־אֵ֑ל וְאוּלָ֛ם ל֥וּז שֵׁם־הָעִ֖יר לָרִאשֹׁנָֽה",
      audio: "ויצא10.mp3",
      isFullPasuk: true,
      pasukNumber: 10,
    },

    // Pasuk 11 (Bereshit 28:20) - Parts
    {
      title: "Bereshit 28:20 - Part 1",
      text: "וַיִּדַּ֥ר יַעֲקֹ֖ב נֶ֣דֶר לֵאמֹ֑ר אִם־יִהְיֶ֨ה אֱלֹהִ֜ים עִמָּדִ֗י",
      audio: "ויצא11א.mp3",
      isFullPasuk: false,
      pasukNumber: 11,
    },
    {
      title: "Bereshit 28:20 - Part 2",
      text: "וּשְׁמָרַ֙נִי֙ בַּדֶּ֤רֶךְ הַזֶּה֙ אֲשֶׁ֣ר אָנֹכִ֣י הוֹלֵ֔ךְ",
      audio: "ויצא11ב.mp3",
      isFullPasuk: false,
      pasukNumber: 11,
    },
    {
      title: "Bereshit 28:20 - Part 3",
      text: "וְנָֽתַן־לִ֥י לֶ֛חֶם לֶאֱכֹ֖ל וּבֶ֥גֶד לִלְבֹּֽשׁ׃",
      audio: "ויצא11ג.mp3",
      isFullPasuk: false,
      pasukNumber: 11,
    },
    {
      title: "Bereshit 28:20 - Full Pasuk",
      text: "וַיִּדַּ֥ר יַעֲקֹ֖ב נֶ֣דֶר לֵאמֹ֑ר אִם־יִהְיֶ֨ה אֱלֹהִ֜ים עִמָּדִ֗י וּשְׁמָרַ֙נִי֙ בַּדֶּ֤רֶךְ הַזֶּה֙ אֲשֶׁ֣ר אָנֹכִ֣י הוֹלֵ֔ךְ וְנָֽתַן־לִ֥י לֶ֛חֶם לֶאֱכֹ֖ל וּבֶ֥גֶד לִלְבֹּֽשׁ׃",
      audio: "ויצא11.mp3",
      isFullPasuk: true,
      pasukNumber: 11,
    },

    // Pasuk 12 (Bereshit 28:21) - Single
    {
      title: "Bereshit 28:21",
      text: "וְשַׁבְתִּ֥י בְשָׁל֖וֹם אֶל־בֵּ֣ית אָבִ֑י וְהָיָ֧ה יְהֹוָ֛ה לִ֖י לֵאלֹהִֽים",
      audio: "ויצא12.mp3",
      isFullPasuk: true,
      pasukNumber: 12,
    },

    // Pasuk 13 (Bereshit 28:22) - Parts
    {
      title: "Bereshit 28:22 - Part 1",
      text: "וְהָאֶ֣בֶן הַזֹּ֗את אֲשֶׁר־שַׂ֙מְתִּי֙ מַצֵּבָ֔ה יִהְיֶ֖ה בֵּ֣ית אֱלֹהִ֑ים",
      audio: "ויצא13א.mp3",
      isFullPasuk: false,
      pasukNumber: 13,
    },
    {
      title: "Bereshit 28:22 - Part 2",
      text: "וְכֹל֙ אֲשֶׁ֣ר תִּתֶּן־לִ֔י עַשֵּׂ֖ר אֲעַשְּׂרֶ֥נּוּ לָֽךְ׃",
      audio: "ויצא13ב.mp3",
      isFullPasuk: false,
      pasukNumber: 13,
    },
    {
      title: "Bereshit 28:22 - Full Pasuk",
      text: "וְהָאֶ֣בֶן הַזֹּ֗את אֲשֶׁר־שַׂ֙מְתִּי֙ מַצֵּבָ֔ה יִהְיֶ֖ה בֵּ֣ית אֱלֹהִ֑ים וְכֹל֙ אֲשֶׁ֣ר תִּתֶּן־לִ֔י עַשֵּׂ֖ר אֲעַשְּׂרֶ֥נּוּ לָֽךְ׃",
      audio: "ויצא13.mp3",
      isFullPasuk: true,
      pasukNumber: 13,
    },
  ];

  const TOTAL_BLOCKS = 12;

  // Cache DOM
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

  // State
  let currentIndex = 0;
  let sessionAttemptsPerIndex = new Array(pesukim.length).fill(0); // step attempts (session)
  let stepScores = new Array(pesukim.length).fill(0); // persistent per-step 0..3
  let pasukScoresFull = new Array(TOTAL_BLOCKS).fill(0); // best full-pasuk score only
  let practiceData = {};
  const todayKey = new Date().toISOString().split("T")[0];

  // Parts map per pasuk
  const pasukParts = Array.from({ length: TOTAL_BLOCKS }, () => []);
  const fullIndexByPasuk = new Array(TOTAL_BLOCKS).fill(-1);
  pesukim.forEach((s, idx) => {
    if (s.pasukNumber >= 1 && s.pasukNumber <= TOTAL_BLOCKS) {
      if (s.isFullPasuk) fullIndexByPasuk[s.pasukNumber - 1] = idx;
      else pasukParts[s.pasukNumber - 1].push(idx);
    }
  });

  /*** STORAGE ***/
  function getPracticeData() {
    const data = localStorage.getItem("barMitzvahPracticeData");
    return data ? JSON.parse(data) : {};
  }
  function savePracticeData() {
    localStorage.setItem(
      "barMitzvahPracticeData",
      JSON.stringify(practiceData)
    );
  }
  function loadStepScores() {
    const s = localStorage.getItem("barMitzvahStepScores");
    return s ? JSON.parse(s) : new Array(pesukim.length).fill(0);
  }
  function saveStepScores() {
    localStorage.setItem("barMitzvahStepScores", JSON.stringify(stepScores));
  }
  function loadFullPasukScores() {
    const s = localStorage.getItem("barMitzvahPasukScoresFull");
    return s ? JSON.parse(s) : new Array(TOTAL_BLOCKS).fill(0);
  }
  function saveFullPasukScores() {
    localStorage.setItem(
      "barMitzvahPasukScoresFull",
      JSON.stringify(pasukScoresFull)
    );
  }

  /*** PROGRESS BAR ***/
  function createProgressBar() {
    progressBarContainer.innerHTML = "";
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      const blk = document.createElement("div");
      blk.className = "progress-block pb-gray";
      const fill = document.createElement("div");
      fill.className = "fill";
      blk.appendChild(fill);
      progressBarContainer.appendChild(blk);
    }
    redrawProgressBar();
  }

  /**
   * Compute fraction per pasuk:
   * fraction = max( fullScore/3 , sum(partScores)/(3 * partsCount) )
   * Tier colors: 0..33% -> pb-1, 33..66% -> pb-2, 66..100% -> pb-3, 0 -> pb-gray
   */
  function computePasukFraction(pasukIdx) {
    const fullIdx = fullIndexByPasuk[pasukIdx];
    const parts = pasukParts[pasukIdx];

    let fullFrac = 0;
    if (fullIdx !== -1) {
      const s = Math.max(pasukScoresFull[pasukIdx], stepScores[fullIdx] || 0);
      fullFrac = s / 3;
    }

    let partFrac = 0;
    if (parts.length > 0) {
      const sum = parts.reduce((acc, i) => acc + (stepScores[i] || 0), 0);
      partFrac = sum / (3 * parts.length);
    }

    return Math.max(fullFrac, partFrac);
  }

  function redrawProgressBar() {
    const blocks = Array.from(progressBarContainer.children);
    blocks.forEach((blk, i) => {
      const frac = computePasukFraction(i); // 0..1
      const fill = blk.querySelector(".fill");
      fill.style.width = `${Math.round(frac * 100)}%`;

      blk.classList.remove("pb-gray", "pb-1", "pb-2", "pb-3");
      if (frac <= 0) {
        blk.classList.add("pb-gray");
      } else if (frac < 1 / 3) {
        blk.classList.add("pb-1");
      } else if (frac < 2 / 3) {
        blk.classList.add("pb-2");
      } else {
        blk.classList.add("pb-3");
      }
    });
  }

  /*** PRACTICE LOG (FLOATING) ***/
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
    if (startIdx === -1) return; // keep only header

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
    });
  }

  /*** RENDER / FEEDBACK ***/
  function renderStep(index) {
    const step = pesukim[index];
    titleElement.textContent = step.title;
    pasukTextElement.textContent = step.text;
    audioSourceElement.src = step.audio;
    audioElement.load();
    showFeedback("", "");
    endAliyahControls.hidden = true;
  }

  function showFeedback(msg, type) {
    feedbackDiv.textContent = msg;
    feedbackDiv.className = `feedback ${type || ""}`;
  }

  /*** SCORING ***/
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

  // Update persistent step score (0..3). For full-pasuk, also track best full score per pasuk.
  function updateStepScore(stepIdx) {
    const attempts = sessionAttemptsPerIndex[stepIdx];
    const earned = pointsFromAttempts(attempts); // 3/2/1
    stepScores[stepIdx] = Math.max(stepScores[stepIdx], earned);
    const step = pesukim[stepIdx];
    if (step.isFullPasuk) {
      const pIdx = step.pasukNumber - 1;
      pasukScoresFull[pIdx] = Math.max(pasukScoresFull[pIdx], earned);
    }
    saveStepScores();
    saveFullPasukScores();
  }

  /*** BUTTONS ***/
  didWellButton.addEventListener("click", function () {
    const step = pesukim[currentIndex];

    updateDailyPoints(currentIndex);
    updateStepScore(currentIndex);
    redrawProgressBar();

    // Advance
    currentIndex++;
    if (currentIndex < pesukim.length) {
      showFeedback("Great job! Moving on to the next part.", "success");
      renderStep(currentIndex);
    } else {
      showFeedback("You finished this Aliyah.", "success");
      endAliyahControls.hidden = false;
      confetti({ particleCount: 220, spread: 100, origin: { y: 0.6 } });
    }
  });

  needPracticeButton.addEventListener("click", function () {
    sessionAttemptsPerIndex[currentIndex]++;
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
    sessionAttemptsPerIndex = new Array(pesukim.length).fill(0);
    currentIndex = 0;
    endAliyahControls.hidden = true;
    renderStep(currentIndex);
    showFeedback("The Aliyah has restarted.", "");
  });

  /*** INIT ***/
  function initialize() {
    practiceData = getPracticeData();
    stepScores = loadStepScores();
    pasukScoresFull = loadFullPasukScores();

    const todayData = practiceData[todayKey] || { points: 0, activeSeconds: 0 };
    pointsSpan.textContent = todayData.points;

    createProgressBar();
    renderStep(currentIndex);
    renderFloatingPracticeLog();
    startActiveTimeTracker();

    // Mark loaded
    setLoaded();
  }

  // Start
  initialize();
})();
