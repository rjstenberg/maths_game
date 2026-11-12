
const ADDITION_MODE = {
  map: "assets/map-addition.png",
  settings: {
    randomizeQuestions: true,
    finalTestDuration: 3 * 60,
    finalTestPassScore: 18,
    normalLevelPassScore: 0.71
  },

  levels: [
    { id: "level1", label: "1", title: "Två steg framåt", top: "15%", left: "25%", state: "open" },
    { id: "level2", label: "2", title: "Dubbelt", top: "15%", left: "55%", state: "locked" },
    { id: "level3", label: "3", title: "Nästan dubbelt", top: "10%", left: "75%", state: "locked" },
    { id: "level4", label: "4", title: "Över tio", top: "39%", left: "67%", state: "locked" },
    { id: "bonusLevel", label: "⭐", top: "26%", left: "88.5%", state: "locked", type: "bonus" },
    { id: "level5", label: "5", title: "Tiokompisen", top: "55%", left: "40%", state: "locked" },
    { id: "level6", label: "6", title: "Allt inom 10", top: "81%", left: "26%", state: "locked" },
    { id: "level7", label: "7", title: "Allt inom 20", top: "88%", left: "40%", state: "locked" },
    { id: "finalLevel", label: "🔥", title: "Mästarprovet 🏁", top: "84%", left: "76%", state: "locked" }
  ],

  unlocks: {
    level1: ["level2"],
    level2: ["level3", "level4", "level5"],
    level3: ["bonusLevel"],
    level4: ["bonusLevel"],
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

  animalPosition: { top: "43.5%", left: "19%" },

  getQuestionsByLevel() {
    const questionsByLevel = {};

    const makeQuestion = (a, b) => ({
      q: `${a} + ${b} =`,
      a: String(a + b)
    });

    // Level 1: +2, within 10
    questionsByLevel.level1 = [];
    for (let a = 0; a <= 8; a++) {
      questionsByLevel.level1.push(makeQuestion(a, 2));
    }

    // Level 2: Doubles
    questionsByLevel.level2 = [];
    for (let a = 1; a <= 10; a++) {
      questionsByLevel.level2.push(makeQuestion(a, a));
    }

    // Level 3: Near doubles
    questionsByLevel.level3 = [];
    for (let a = 1; a <= 9; a++) {
      questionsByLevel.level3.push(makeQuestion(a, a + 1));
    }

    // Level 4: Make ten (crossing ten)
    questionsByLevel.level4 = [];
    for (let a = 1; a <= 9; a++) {
      for (let b = a; b <= 9; b++) {
        if (a + b > 10) {
          questionsByLevel.level4.push(makeQuestion(a, b));
        }
      }
    }

    // Level 5: Missing number to make ten
    questionsByLevel.level5 = [];
    for (let a = 1; a <= 9; a++) {
      questionsByLevel.level5.push({
        q: `${a} + ? = 10`,
        a: String(10 - a)
      });
    }

    // Level 6: All addition within 10
    questionsByLevel.level6 = [];
    for (let a = 0; a <= 10; a++) {
      for (let b = a; a + b <= 10; b++) {
        questionsByLevel.level6.push(makeQuestion(a, b));
      }
    }

    // Level 7: All addition within 20
    questionsByLevel.level7 = [];
    for (let a = 0; a <= 20; a++) {
      for (let b = a; a + b <= 20; b++) {
        questionsByLevel.level7.push(makeQuestion(a, b));
      }
    }

    return questionsByLevel;
  },

  getFinalTestQuestions() {
    return this.getQuestionsByLevel().level7;
  }
};
