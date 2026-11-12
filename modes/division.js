
const DIVISION_MODE = {
  map: "assets/map-division.png",
  settings: {
    randomizeQuestions: true,
    finalTestDuration: 3 * 60,
    finalTestPassScore: 18,
    normalLevelPassScore: 0.71
  },

  levels: [
    { id: "level1", label: "1", title: "Dela med 2", top: "15%", left: "25%", state: "open" },
    { id: "level2", label: "2", title: "Dela med 3", top: "15%", left: "53%", state: "locked" },
    { id: "level3", label: "3", title: "Dela med 4", top: "10%", left: "75%", state: "locked" },
    { id: "level4", label: "4", title: "Dela med 5", top: "36%", left: "67%", state: "locked" },
    { id: "bonusLevel", label: "⭐", top: "20.2%", left: "88.5%", state: "locked", type: "bonus" },
    { id: "level5", label: "5", title: "Dela med 6 och 7", top: "55%", left: "40%", state: "locked" },
    { id: "level6", label: "6", title: "Dela med 8 och 9", top: "86%", left: "23%", state: "locked" },
    { id: "level7", label: "7", title: "Blandad division", top: "86%", left: "50%", state: "locked" },
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
    "Lejon": "🦁",
    "Tiger": "🐯",
    "Orm": "🐍",
    "Elefant": "🐘",
    "Krokodil": "🐊",
    "Enhörning": "🦄"
  },

  getQuestionsByLevel() {
    const questionsByLevel = {};

    const makeQuestion = (divisor, answer) => ({
      q: `${divisor * answer} ÷ ${divisor} =`,
      a: String(answer)
    });

    // Levels 1–4: Divide by 2, 3, 4 and 5
    for (let divisor = 2; divisor <= 5; divisor++) {
      const levelQuestions = [];

      for (let answer = 1; answer <= 9; answer++) {
        levelQuestions.push(makeQuestion(divisor, answer));
      }

      questionsByLevel[`level${divisor - 1}`] = levelQuestions;
    }

    // Level 5: Divide by 6 and 7
    questionsByLevel.level5 = [];
    for (let divisor = 6; divisor <= 7; divisor++) {
      for (let answer = 1; answer <= 9; answer++) {
        questionsByLevel.level5.push(makeQuestion(divisor, answer));
      }
    }

    // Level 6: Divide by 8 and 9
    questionsByLevel.level6 = [];
    for (let divisor = 8; divisor <= 9; divisor++) {
      for (let answer = 1; answer <= 9; answer++) {
        questionsByLevel.level6.push(makeQuestion(divisor, answer));
      }
    }

    // Level 7: Mixed division by 2–9
    questionsByLevel.level7 = [];
    for (let divisor = 2; divisor <= 9; divisor++) {
      for (let answer = 1; answer <= 9; answer++) {
        questionsByLevel.level7.push(makeQuestion(divisor, answer));
      }
    }

    return questionsByLevel;
  },

  getFinalTestQuestions() {
    return this.getQuestionsByLevel().level7;
  }
};
