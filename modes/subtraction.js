
const SUBTRACTION_MODE = {
  map: "assets/map-subtraction.png",
  settings: {
    randomizeQuestions: true,
    finalTestDuration: 3 * 60,
    finalTestPassScore: 18,
    normalLevelPassScore: 0.71
  },


get levels() {
  const easyTitles = [
    "Ett steg bakåt",
    "Två steg bakåt",
    "Från 5",
    "Inom 5",
    "Hälften",
    "Från 10",
    "Inom 10"
  ];

  const levels = [
    { id: "level1", label: "1", title: "Ett steg bakåt", top: "15%", left: "25%", state: "open" },
    { id: "level2", label: "2", title: "Två steg bakåt", top: "15%", left: "55%", state: "locked" },
    { id: "level3", label: "3", title: "Från 10", top: "10%", left: "75%", state: "locked" },
    { id: "level4", label: "4", title: "Inom 10", top: "39%", left: "67%", state: "locked" },
    { id: "bonusLevel", label: "⭐", top: "26%", left: "88.5%", state: "locked", type: "bonus" },
    { id: "level5", label: "5", title: "Hälften", top: "55%", left: "40%", state: "locked" },
    { id: "level6", label: "6", title: "Förbi 10", top: "81%", left: "26%", state: "locked" },
    { id: "level7", label: "7", title: "Inom 20", top: "88%", left: "40%", state: "locked" },
    { id: "finalLevel", label: "🔥", title: "Mästarprovet 🏁", top: "84%", left: "76%", state: "locked" }
  ];

  if (GAME_DIFFICULTY === "10") {
    levels.forEach(level => {
      const levelNumber = Number(level.label);
      if (levelNumber >= 1 && levelNumber <= 7) {
        level.title = easyTitles[levelNumber - 1];
      }
    });
  }

  return levels;
},


  unlocks: {
    level1: ["level2"],
    level2: ["level3"],
    level3: ["level4", "bonusLevel"],
    level4: ["level5"],
    level5: ["level6"],
    level6: ["level7"],
    level7: ["finalLevel"]
  },

  animals: {
    "Räv": "🦊",
    "Igelkott": "🦔",
    "Ekorre": "🐿️",
    "Björn": "🐻",
    "Älg": "🫎",
    "Bäver": "🦫"
  },

  mirroredAnimals: ["Igelkott", "Ekorre", "Bäver"],

  animalPosition: { top: "40%", left: "15%" },

  reunionPosition: {
    duplicate: { top: "84%", left: "76%" },
    destination: { top: "40%", left: "26%" },
    heart: { top: "32%", left: "20.5%" }
  },

  obstacle: { emoji: "🪵", top: "35%", left: "52%" },

  
getQuestionsByLevel() {
  const questionsByLevel = {};

  const makeQuestion = (a, b) => ({
    q: `${a} − ${b} =`,
    a: String(a - b)
  });

  if (GAME_DIFFICULTY === "10") {
    // Level 1: Minus 1
    questionsByLevel.level1 = [];
    for (let a = 1; a <= 10; a++) {
      questionsByLevel.level1.push(makeQuestion(a, 1));
    }

    // Level 2: Minus 2
    questionsByLevel.level2 = [];
    for (let a = 2; a <= 10; a++) {
      questionsByLevel.level2.push(makeQuestion(a, 2));
    }

    // Level 3: Från 5
    questionsByLevel.level3 = [];
    for (let b = 1; b <= 5; b++) {
      questionsByLevel.level3.push(makeQuestion(5, b));
    }

    // Level 4: Inom 5
    questionsByLevel.level4 = [];
    for (let a = 1; a <= 5; a++) {
      for (let b = 1; b <= a; b++) {
        questionsByLevel.level4.push(makeQuestion(a, b));
      }
    }

    // Level 5: Hälften (reverse doubles within 10)
    questionsByLevel.level5 = [];
    for (let a = 1; a <= 5; a++) {
      questionsByLevel.level5.push(makeQuestion(a * 2, a));
    }

    // Level 6: Från 10
    questionsByLevel.level6 = [];
    for (let b = 1; b <= 10; b++) {
      questionsByLevel.level6.push(makeQuestion(10, b));
    }

    // Level 7: Inom 10
    questionsByLevel.level7 = [];
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= a; b++) {
        questionsByLevel.level7.push(makeQuestion(a, b));
      }
    }
  } else {
    // Level 1: Subtract 1, within 10
    questionsByLevel.level1 = [];
    for (let a = 1; a <= 10; a++) {
      questionsByLevel.level1.push(makeQuestion(a, 1));
    }

    // Level 2: Subtract 2, within 10
    questionsByLevel.level2 = [];
    for (let a = 2; a <= 10; a++) {
      questionsByLevel.level2.push(makeQuestion(a, 2));
    }

    // Level 3: Subtract from 10
    questionsByLevel.level3 = [];
    for (let b = 1; b <= 10; b++) {
      questionsByLevel.level3.push(makeQuestion(10, b));
    }

    // Level 4: Mixed subtraction within 10
    questionsByLevel.level4 = [];
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= a; b++) {
        questionsByLevel.level4.push(makeQuestion(a, b));
      }
    }

    // Level 5: Halves (reverse doubles)
    questionsByLevel.level5 = [];
    for (let a = 1; a <= 10; a++) {
      questionsByLevel.level5.push(makeQuestion(a * 2, a));
    }

    // Level 6: Think addition, crossing ten
    questionsByLevel.level6 = [];
    for (let a = 11; a <= 20; a++) {
      for (let b = 2; b <= 9; b++) {
        if (a - b >= 1 && a - b < 10) {
          questionsByLevel.level6.push(makeQuestion(a, b));
        }
      }
    }

    // Level 7: All subtraction within 20
    questionsByLevel.level7 = [];
    for (let a = 1; a <= 20; a++) {
      for (let b = 1; b <= a; b++) {
        questionsByLevel.level7.push(makeQuestion(a, b));
      }
    }
  }

  return questionsByLevel;
},


  getFinalTestQuestions() {
    return this.getQuestionsByLevel().level7;
  }
};
