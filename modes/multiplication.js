// ====================
// Question generation, create levels 3–9 (each with 3×3 .. 9×9)
// ====================

const MULTIPLICATION_MODE = {

  settings: {
    randomizeQuestions: true,
    finalTestDuration: 3 * 60,
    finalTestPassScore: 18,
    normalLevelPassScore: 5
  },

  levels: [
    { id: "table3", label: "1", top: "15%", left: "25%", state: "open" },
    { id: "table4", label: "2", top: "15%", left: "53%", state: "locked" },
    { id: "table5", label: "3", top: "10%", left: "75%", state: "locked" },
    { id: "table6", label: "4", top: "36%", left: "67%", state: "locked" },
    { id: "bonusLevel", label: "⭐", top: "20.2%", left: "88.5%", state: "locked", type: "bonus" },
    { id: "table7", label: "5", top: "55%", left: "40%", state: "locked" },
    { id: "table8", label: "6", top: "86%", left: "23%", state: "locked" },
    { id: "table9", label: "7", top: "86%", left: "50%", state: "locked" },
    { id: "finalLevel", label: "🔥", top: "84%", left: "76%", state: "locked" }
  ],

  animals: {
    "Hund": "🐶",
    "Katt": "🐱",
    "Hamster": "🐹",
    "Kanin": "🐰",
    "Gris": "🐷",
    "Fjäril": "🦋"
  },

  getQuestionsByLevel() {

    const questionsByLevel = [];

    for (let table = 3; table <= 10; table++) {
      const levelQuestions = [];

      for (let i = 3; i <= 9; i++) {
        levelQuestions.push({
          q: `${table} · ${i} =`,
          a: String(table * i)
        });
      }

      questionsByLevel.push(levelQuestions);

      // Keep indexes aligned with the bonus level
      if (table === 7) {
        questionsByLevel.push([...levelQuestions]);
      }
    }

    return questionsByLevel;
  },

  getFinalTestQuestions() {
    const uniquePairs = new Set();
    const allQuestions = [];

    for (let a = 3; a <= 9; a++) {
      for (let b = 3; b <= 9; b++) {
        const key = [Math.min(a, b), Math.max(a, b)].join("×");

        if (!uniquePairs.has(key)) {
          uniquePairs.add(key);
          allQuestions.push({
            q: `${a} · ${b} =`,
            a: String(a * b)
          });
        }
      }
    }

    shuffleArray(allQuestions);
    return allQuestions.slice(0, 20);
  }
};
