
const DIVISION_MODE = {
  map: "assets/map-division.png",
  settings: {
    randomizeQuestions: true,
    finalTestDuration: 3 * 60,
    finalTestPassScore: 18,
    normalLevelPassScore: 0.71
  },

  levels: [
    { id: "level1", label: "1", title: "Dela med 3", top: "15%", left: "27%", state: "open" },
    { id: "level2", label: "2", title: "Dela med 4", top: "18%", left: "56%", state: "locked" },
    { id: "level3", label: "3", title: "Dela med 5", top: "12%", left: "75%", state: "locked" },
    { id: "level4", label: "4", title: "Dela med 6", top: "39%", left: "67%", state: "locked" },
    { id: "bonusLevel", label: "⭐", top: "27%", left: "89%", state: "locked", type: "bonus" },
    { id: "level5", label: "5", title: "Dela med 7", top: "57%", left: "36%", state: "locked" },
    { id: "level6", label: "6", title: "Dela med 8", top: "82%", left: "28%", state: "locked" },
    { id: "level7", label: "7", title: "Dela med 9", top: "86%", left: "50%", state: "locked" },
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

  mirroredAnimals: ["Orm", "Elefant", "Krokodil", "Enhörning"],


  animalPosition: { top: "43%", left: "16%" },

  reunionPosition: {
   duplicate: { top: "84%", left: "76%" },
   destination: { top: "40%", left: "26%" },
   heart: { top: "32%", left: "20.5%" }
  },

  getQuestionsByLevel() {
    const questionsByLevel = {};

    const makeQuestion = (divisor, answer) => ({
      q: `${divisor * answer} ÷ ${divisor} =`,
      a: String(answer)
    });

    // Levels 1–7: Divide by 3 through 9
    for (let divisor = 3; divisor <= 9; divisor++) {
      const levelQuestions = [];

      for (let answer = 1; answer <= 9; answer++) {
        levelQuestions.push(makeQuestion(divisor, answer));
      }

      questionsByLevel[`level${divisor - 2}`] = levelQuestions;
    }

    return questionsByLevel;
  },

  getFinalTestQuestions() {
    const questions = [];

    // Mixed division by 2–9 (original Mästarprovet)
    for (let divisor = 2; divisor <= 9; divisor++) {
      for (let answer = 1; answer <= 9; answer++) {
        questions.push({
          q: `${divisor * answer} ÷ ${divisor} =`,
          a: String(answer)
        });
      }
    }

    return questions;
  }
};
