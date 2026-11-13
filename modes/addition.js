
const ADDITION_MODE = {
  map: "assets/map-addition.png",
  settings: {
    randomizeQuestions: true,
    finalTestDuration: 3 * 60,
    finalTestPassScore: 18,
    normalLevelPassScore: 0.71
  },

get levels() {
  const easyTitles = [
    "Ett steg framåt",
    "Två steg framåt",
    "Tiokompisar",
    "Dubbelt",
    "Nästan dubbelt",
    "Inom 10",
    "Inom 10"
  ];

  const levels = [
    { id: "level1", label: "1", title: "Två steg framåt", top: "18%", left: "25%", state: "open" },
    { id: "level2", label: "2", title: "Tiokompisar", top: "17%", left: "56%", state: "locked" },
    { id: "level3", label: "3", title: "Inom 10", top: "12%", left: "75%", state: "locked" },
    { id: "level4", label: "4", title: "Dubbelt", top: "41%", left: "67%", state: "locked" },
    { id: "bonusLevel", label: "⭐", top: "26%", left: "91%", state: "locked", type: "bonus" },
    { id: "level5", label: "5", title: "Nästan dubbelt", top: "56%", left: "37%", state: "locked" },
    { id: "level6", label: "6", title: "Över tio", top: "86%", left: "26%", state: "locked" },
    { id: "level7", label: "7", title: "Inom 20", top: "88%", left: "44%", state: "locked" },
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
    "Pingvin": "🐧",
    "Isbjörn": "🐻‍❄️",
    "Säl": "🦭",
    "Uggla": "🦉",
    "Varg": "🐺",
    "Ren": "🦌"
  },

  mirroredAnimals: ["Pingvin", "Säl", "Varg", "Ren"],
  reunionMirroredAnimals: ["Uggla"],

  animalPosition: { top: "45%", left: "15%" },

  reunionPosition: {
    duplicate: { top: "84%", left: "76%" },
    destination: { top: "45%", left: "21%" },
    heart: { top: "40%", left: "18%" }
  },

  obstacle: { emoji: "🧊", top: "35%", left: "52%" },

  
getQuestionsByLevel() {
  const questionsByLevel = {};

  const makeQuestion = (a, b) => ({
    q: `${a} + ${b} =`,
    a: String(a + b)
  });

  if (GAME_DIFFICULTY === "10") {
    // Level 1: Ett steg framåt (+1)
    questionsByLevel.level1 = [];
    for (let a = 0; a <= 9; a++) {
      questionsByLevel.level1.push(makeQuestion(a, 1));
    }

    // Level 2: Två steg framåt (+2)
    questionsByLevel.level2 = [];
    for (let a = 0; a <= 8; a++) {
      questionsByLevel.level2.push(makeQuestion(a, 2));
    }

    // Level 3: Tiokompisar
    questionsByLevel.level3 = [];
    for (let a = 1; a <= 9; a++) {
      questionsByLevel.level3.push({
        q: `${a} + ? = 10`,
        a: String(10 - a)
      });
    }

    // Level 4: Dubbelt (within 10)
    questionsByLevel.level4 = [];
    for (let a = 1; a <= 5; a++) {
      questionsByLevel.level4.push(makeQuestion(a, a));
      questionsByLevel.level4.push(makeQuestion(a, a));
    }

     // Level 5: Nästan dubbelt (within 10)
    questionsByLevel.level5 = [];
    for (let a = 1; a <= 4; a++) {
      questionsByLevel.level5.push(makeQuestion(a, a + 1));
      questionsByLevel.level5.push(makeQuestion(a + 1, a));
    }

    questionsByLevel.level5.push(makeQuestion(1, 2));
    questionsByLevel.level5.push(makeQuestion(2, 3));

    // Levels 6 and 7: All addition within 10
    questionsByLevel.level6 = [];

    for (let a = 1; a <= 10; a++) {
      for (let b = a; a + b <= 10; b++) {
        questionsByLevel.level6.push(makeQuestion(a, b));
      }
    }

    questionsByLevel.level7 = [...questionsByLevel.level6];
  } else {
    // Level 1: +2, within 10
    questionsByLevel.level1 = [];
    for (let a = 0; a <= 8; a++) {
      questionsByLevel.level1.push(makeQuestion(a, 2));
    }

    // Level 2: Number bonds to ten
    questionsByLevel.level2 = [];
    for (let a = 1; a <= 9; a++) {
      questionsByLevel.level2.push({
        q: `${a} + ? = 10`,
        a: String(10 - a)
      });
    }

    // Level 3: All addition within 10
    questionsByLevel.level3 = [];
    for (let a = 1; a <= 10; a++) {
      for (let b = a; a + b <= 10; b++) {
        questionsByLevel.level3.push(makeQuestion(a, b));
      }
    }

    // Level 4: Doubles
    questionsByLevel.level4 = [];
    for (let a = 1; a <= 10; a++) {
      questionsByLevel.level4.push(makeQuestion(a, a));
    }

    // Level 5: Near doubles
    questionsByLevel.level5 = [];
    for (let a = 1; a <= 9; a++) {
      questionsByLevel.level5.push(makeQuestion(a, a + 1));
    }

    // Level 6: Crossing ten
    questionsByLevel.level6 = [];
    for (let a = 1; a <= 9; a++) {
      for (let b = a; b <= 9; b++) {
        if (a + b > 10) {
          questionsByLevel.level6.push(makeQuestion(a, b));
        }
      }
    }

    // Level 7: All addition within 20
    questionsByLevel.level7 = [];
    for (let a = 1; a <= 20; a++) {
      for (let b = a; a + b <= 20; b++) {
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
