// Aliyah 1 data split by pasuk with sub-arrays of steps (parts + full)
const aliyah1 = [
  // Pasuk 1
  {
    pasukNumber: 1,
    steps: [
      {
        title: "Bereshit 28:10",
        text: "וַיֵּצֵ֥א יַעֲקֹ֖ב מִבְּאֵ֣ר שָׁ֑בַע וַיֵּ֖לֶךְ חָרָֽנָה",
        audio: "ויצא1.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 2
  {
    pasukNumber: 2,
    steps: [
      {
        title: "Bereshit 28:11 - Part 1",
        text: "וַיִּפְגַּ֨ע בַּמָּק֜וֹם וַיָּ֤לֶן שָׁ֙ם֙ כִּי־בָ֣א הַשֶּׁ֔מֶשׁ",
        audio: "ויצא2א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:11 - Part 2",
        text: "וַיִּקַּח֙ מֵאַבְנֵ֣י הַמָּק֔וֹם וַיָּ֖שֶׂם מְרַֽאֲשֹׁתָ֑יו",
        audio: "ויצא2ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:11 - Part 3",
        text: "וַיִּשְׁכַּ֖ב בַּמָּק֥וֹם הַהֽוּא׃",
        audio: "ויצא2ג.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:11 - Full Pasuk",
        text: "וַיִּפְגַּ֨ע בַּמָּק֜וֹם וַיָּ֤לֶן שָׁ֙ם֙ כִּי־בָ֣א הַשֶּׁ֔מֶשׁ וַיִּקַּח֙ מֵאַבְנֵ֣י הַמָּק֔וֹם וַיָּ֖שֶׂם מְרַֽאֲשֹׁתָ֑יו וַיִּשְׁכַּ֖ב בַּמָּק֥וֹם הַהֽוּא׃",
        audio: "ויצא2.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 3
  {
    pasukNumber: 3,
    steps: [
      {
        title: "Bereshit 28:12 - Part 1",
        text: "וַֽיַּחֲלֹ֗ם וְהִנֵּ֤ה סֻלָּם֙ מֻצָּ֣ב אַ֔רְצָה וְרֹאשׁ֖וֹ מַגִּ֣יעַ הַשָּׁמָ֑יְמָה",
        audio: "ויצא3א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:12 - Part 2",
        text: "וְהִנֵּה֙ מַלְאֲכֵ֣י אֱלֹהִ֔ים עֹלִ֥ים וְיֹרְדִ֖ים בּֽוֹ׃",
        audio: "ויצא3ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:12 - Full Pasuk",
        text: "וַֽיַּחֲלֹ֗ם וְהִנֵּ֤ה סֻלָּם֙ מֻצָּ֣ב אַ֔רְצָה וְרֹאשׁ֖וֹ מַגִּ֣יעַ הַשָּׁמָ֑יְמָה וְהִנֵּה֙ מַלְאֲכֵ֣י אֱלֹהִ֔ים עֹלִ֥ים וְיֹרְדִ֖ים בּֽוֹ׃",
        audio: "ויצא3.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 4
  {
    pasukNumber: 4,
    steps: [
      {
        title: "Bereshit 28:13 - Part 1",
        text: "וְהִנֵּ֨ה יְהֹוָ֜ה נִצָּ֣ב עָלָיו֮ וַיֹּאמַר֒",
        audio: "ויצא4א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:13 - Part 2",
        text: "אֲנִ֣י יְהֹוָ֗ה אֱלֹהֵי֙ אַבְרָהָ֣ם אָבִ֔יךָ וֵאלֹהֵ֖י יִצְחָ֑ק",
        audio: "ויצא4ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:13 - Part 3",
        text: "הָאָ֗רֶץ אֲשֶׁ֤ר אַתָּה֙ שֹׁכֵ֣ב עָלֶ֔יהָ לְךָ֥ אֶתְּנֶ֖נָּה וּלְזַרְעֶֽךָ׃",
        audio: "ויצא4ג.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:13 - Full Pasuk",
        text: "וְהִנֵּ֨ה יְהֹוָ֜ה נִצָּ֣ב עָלָיו֮ וַיֹּאמַר֒ אֲנִ֣י יְהֹוָ֗ה אֱלֹהֵי֙ אַבְרָהָ֣ם אָבִ֔יךָ וֵאלֹהֵ֖י יִצְחָ֑ק הָאָ֗רֶץ אֲשֶׁ֤ר אַתָּה֙ שֹׁכֵ֣ב עָלֶ֔יהָ לְךָ֥ אֶתְּנֶ֖נָּה וּלְזַרְעֶֽךָ׃",
        audio: "ויצא4.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 5
  {
    pasukNumber: 5,
    steps: [
      {
        title: "Bereshit 28:14 - Part 1",
        text: "וְהָיָ֤ה זַרְעֲךָ֙ כַּעֲפַ֣ר הָאָ֔רֶץ וּפָרַצְתָּ֛ יָ֥מָּה וָקֵ֖דְמָה וְצָפֹ֣נָה וָנֶ֑גְבָּה",
        audio: "ויצא5א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:14 - Part 2",
        text: "וְנִבְרְﬞכ֥וּ בְךָ֛ כׇּל־מִשְׁפְּחֹ֥ת הָאֲדָמָ֖ה וּבְזַרְעֶֽךָ׃",
        audio: "ויצא5ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:14 - Full Pasuk",
        text: "וְהָיָ֤ה זַרְעֲךָ֙ כַּעֲפַ֣ר הָאָ֔רֶץ וּפָרַצְתָּ֛ יָ֥מָּה וָקֵ֖דְמָה וְצָפֹ֣נָה וָנֶ֑גְבָּה וְנִבְרְﬞכ֥וּ בְךָ֛ כׇּל־מִשְׁפְּחֹ֥ת הָאֲדָמָ֖ה וּבְזַרְעֶֽךָ׃",
        audio: "ויצא5.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 6
  {
    pasukNumber: 6,
    steps: [
      {
        title: "Bereshit 28:15 - Part 1",
        text: "וְהִנֵּ֨ה אָנֹכִ֜י עִמָּ֗ךְ",
        audio: "ויצא6א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:15 - Part 2",
        text: "וּשְׁמַרְתִּ֙יךָ֙ בְּכֹ֣ל אֲשֶׁר־תֵּלֵ֔ךְ וַהֲשִׁ֣בֹתִ֔יךָ אֶל־הָאֲדָמָ֖ה הַזֹּ֑את",
        audio: "ויצא6ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:15 - Part 3",
        text: "כִּ֚י לֹ֣א אֶֽעֱזׇבְךָ֔ עַ֚ד אֲשֶׁ֣ר אִם־עָשִׂ֔יתִי אֵ֥ת אֲשֶׁר־דִּבַּ֖רְתִּי לָֽךְ׃",
        audio: "ויצא6ג.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:15 - Full Pasuk",
        text: "וְהִנֵּ֨ה אָנֹכִ֜י עִמָּ֗ךְ וּשְׁמַרְתִּ֙יךָ֙ בְּכֹ֣ל אֲשֶׁר־תֵּלֵ֔ךְ וַהֲשִׁ֣בֹתִ֔יךָ אֶל־הָאֲדָמָ֖ה הַזֹּ֑את כִּ֚י לֹ֣א אֶֽעֱזׇבְךָ֔ עַ֚ד אֲשֶׁ֣ר אִם־עָשִׂ֔יתִי אֵ֥ת אֲשֶׁר־דִּבַּ֖רְתִּי לָֽךְ׃",
        audio: "ויצא6.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 7
  {
    pasukNumber: 7,
    steps: [
      {
        title: "Bereshit 28:16",
        text: "וַיִּיקַ֣ץ יַעֲקֹב֮ מִשְּׁנָתוֹ֒ וַיֹּ֕אמֶר אָכֵן֙ יֵ֣שׁ יְהֹוָ֔ה בַּמָּק֖וֹם הַזֶּ֑ה וְאָנֹכִ֖י לֹ֥א יָדָֽעְתִּי׃",
        audio: "ויצא7.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 8
  {
    pasukNumber: 8,
    steps: [
      {
        title: "Bereshit 28:17 - Part 1",
        text: "וַיִּירָא֙ וַיֹּאמַ֔ר מַה־נּוֹרָ֖א הַמָּק֣וֹם הַזֶּ֑ה",
        audio: "ויצא8א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:17 - Part 2",
        text: "אֵ֣ין זֶ֗ה כִּ֚י אִם־בֵּ֣ית אֱלֹהִ֔ים וְזֶ֖ה שַׁ֥עַר הַשָּׁמָֽיִם׃",
        audio: "ויצא8ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:17 - Full Pasuk",
        text: "וַיִּירָא֙ וַיֹּאמַ֔ר מַה־נּוֹרָ֖א הַמָּק֣וֹם הַזֶּ֑ה אֵ֣ין זֶ֗ה כִּ֚י אִם־בֵּ֣ית אֱלֹהִ֔ים וְזֶ֖ה שַׁ֥עַר הַשָּׁמָֽיִם׃",
        audio: "ויצא8.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 9
  {
    pasukNumber: 9,
    steps: [
      {
        title: "Bereshit 28:18 - Part 1",
        text: "וַיַּשְׁכֵּ֨ם יַעֲקֹ֜ב בַּבֹּ֗קֶר",
        audio: "ויצא9א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:18 - Part 2",
        text: "וַיִּקַּ֤ח אֶת־הָאֶ֙בֶן֙ אֲשֶׁר־שָׂ֣ם מְרַֽאֲשֹׁתָ֔יו",
        audio: "ויצא9ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:18 - Part 3",
        text: "וַיָּ֥שֶׂם אֹתָ֖הּ מַצֵּבָ֑ה וַיִּצֹ֥ק שֶׁ֖מֶן עַל־רֹאשָֽׁהּ",
        audio: "ויצא9ג.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:18 - Full Pasuk",
        text: "וַיַּשְׁכֵּ֨ם יַעֲקֹ֜ב בַּבֹּ֗קֶר וַיִּקַּ֤ח אֶת־הָאֶ֙בֶן֙ אֲשֶׁר־שָׂ֣ם מְרַֽאֲשֹׁתָ֔יו וַיָּ֥שֶׂם אֹתָ֖הּ מַצֵּבָ֑ה וַיִּצֹ֥ק שֶׁ֖מֶן עַל־רֹאשָֽׁהּ",
        audio: "ויצא9.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 10
  {
    pasukNumber: 10,
    steps: [
      {
        title: "Bereshit 28:19",
        text: "וַיִּקְרָ֛א אֶת־שֵֽׁם־הַמָּק֥וֹם הַה֖וּא בֵּֽית־אֵ֑ל וְאוּלָ֛ם ל֥וּז שֵׁם־הָעִ֖יר לָרִאשֹׁנָֽה",
        audio: "ויצא10.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 11
  {
    pasukNumber: 11,
    steps: [
      {
        title: "Bereshit 28:20 - Part 1",
        text: "וַיִּדַּ֥ר יַעֲקֹ֖ב נֶ֣דֶר לֵאמֹ֑ר אִם־יִהְיֶ֨ה אֱלֹהִ֜ים עִמָּדִ֗י",
        audio: "ויצא11א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:20 - Part 2",
        text: "וּשְׁמָרַ֙נִי֙ בַּדֶּ֤רֶךְ הַזֶּה֙ אֲשֶׁ֣ר אָנֹכִ֣י הוֹלֵ֔ךְ",
        audio: "ויצא11ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:20 - Part 3",
        text: "וְנָֽתַן־לִ֥י לֶ֛חֶם לֶאֱכֹ֖ל וּבֶ֥גֶד לִלְבֹּֽשׁ׃",
        audio: "ויצא11ג.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:20 - Full Pasuk",
        text: "וַיִּדַּ֥ר יַעֲקֹ֖ב נֶ֣דֶר לֵאמֹ֑ר אִם־יִהְיֶ֨ה אֱלֹהִ֜ים עִמָּדִ֗י וּשְׁמָרַ֙נִי֙ בַּדֶּ֤רֶךְ הַזֶּה֙ אֲשֶׁ֣ר אָנֹכִ֣י הוֹלֵ֔ךְ וְנָֽתַן־לִ֥י לֶ֛חֶם לֶאֱכֹ֖ל וּבֶ֥גֶד לִלְבֹּֽשׁ׃",
        audio: "ויצא11.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 12
  {
    pasukNumber: 12,
    steps: [
      {
        title: "Bereshit 28:21",
        text: "וְשַׁבְתִּ֥י בְשָׁל֖וֹם אֶל־בֵּ֣ית אָבִ֑י וְהָיָ֧ה יְהֹוָ֛ה לִ֖י לֵאלֹהִֽים",
        audio: "ויצא12.mp3",
        isFullPasuk: true,
      },
    ],
  },
  // Pasuk 13
  {
    pasukNumber: 13,
    steps: [
      {
        title: "Bereshit 28:22 - Part 1",
        text: "וְהָאֶ֣בֶן הַזֹּ֗את אֲשֶׁר־שַׂ֙מְתִּי֙ מַצֵּבָ֔ה יִהְיֶ֖ה בֵּ֣ית אֱלֹהִ֑ים",
        audio: "ויצא13א.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:22 - Part 2",
        text: "וְכֹל֙ אֲשֶׁ֣ר תִּתֶּן־לִ֔י עַשֵּׂ֖ר אֲעַשְּׂרֶ֥נּוּ לָֽךְ׃",
        audio: "ויצא13ב.mp3",
        isFullPasuk: false,
      },
      {
        title: "Bereshit 28:22 - Full Pasuk",
        text: "וְהָאֶ֣בֶן הַזֹּ֗את אֲשֶׁר־שַׂ֙מְתִּי֙ מַצֵּבָ֔ה יִהְיֶ֖ה בֵּ֣ית אֱלֹהִ֑ים וְכֹל֙ אֲשֶׁ֣ר תִּתֶּן־לִ֔י עַשֵּׂ֖ר אֲעַשְּׂרֶ֥נּוּ לָֽךְ׃",
        audio: "ויצא13.mp3",
        isFullPasuk: true,
      },
    ],
  },
];

export default aliyah1;
