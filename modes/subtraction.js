
const SUBTRACTION_MODE = {
  map: "assets/map-subtraction.png",
  settings: {
    randomizeQuestions: true,
    finalTestDuration: 3 * 60,
    finalTestPassScore: 18,
    normalLevelPassScore: 0.71
  },

  levels: [
    { id: "level1", label: "1", title: "Ett steg bakåt", top: "15%", left: "25%", state: "open" },
    { id: "level2", label: "2", title: "Två steg bakåt", top: "15%", left: "53%", state: "locked" },
    { id: "level3", label: "3", title: "Från 10", top: "10%", left: "75%", state: "locked" },
    { id: "level4", label: "4", title: "Halvor", top: "36%", left: "67%", state: "locked" },
    { id: "bonusLevel", label: "⭐", top: "20.2%", left: "88.5%", state: "locked", type: "bonus" },
    { id: "level5", label: "5", title: "Allt inom 10", top: "55%", left: "40%", state: "locked" },
    { id: "level6", label: "6", title: "Över tio", top: "86%", left: "23%", state: "locked" },
    { id: "level7", label: "7", title: "Allt inom 20", top: "86%", left: "50%", state: "locked" },
    { id: "finalLevel", label: "🔥", title: "Finaltest 🏁", top: "84%", left: "76%", state: "locked" }
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
    "Räv": "🦊",
    "Igelkott": "🦔",
    "Ekorre": "🐿️",
    "Björn": "🐻",
    "Älg": "🫎",
    "Bäver": "🦫"
  },

  getQuestionsByLevel() {
    const questionsByLevel = {};

    const makeQuestion = (a, b) => ({
      q: `${a} − ${b} =`,
      a: String(a - b)
    });

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

    // Level 4: Halves (reverse doubles)
    questionsByLevel.level4 = [];
    for (let a = 1; a <= 10; a++) {
      questionsByLevel.level4.push(makeQuestion(a * 2, a));
    }

    // Level 5: Mixed subtraction within 10
    questionsByLevel.level5 = [];
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= a; b++) {
        questionsByLevel.level5.push(makeQuestion(a, b));
      }
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

    return questionsByLevel;
  },

  getFinalTestQuestions() {
    return this.getQuestionsByLevel().level7;
  }
};
