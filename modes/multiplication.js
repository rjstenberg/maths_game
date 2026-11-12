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
    { id: "level1", label: "1", title: "Tabell 3", top: "15%", left: "25%", state: "open" },
    { id: "level2", label: "2", title: "Tabell 4", top: "15%", left: "53%", state: "locked" },
    { id: "level3", label: "3", title: "Tabell 5", top: "10%", left: "75%", state: "locked" },
    { id: "level4", label: "4", title: "Tabell 6", top: "36%", left: "67%", state: "locked" },
    { id: "bonusLevel", label: "⭐", top: "20.2%", left: "88.5%", state: "locked", type: "bonus" },
    { id: "level5", label: "5", title: "Tabell 7", top: "55%", left: "40%", state: "locked" },
    { id: "level6", label: "6", title: "Tabell 8", top: "86%", left: "23%", state: "locked" },
    { id: "level7", label: "7", title: "Tabell 9", top: "86%", left: "50%", state: "locked" },
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
    "Hund": "🐶",
    "Katt": "🐱",
    "Hamster": "🐹",
    "Kanin": "🐰",
    "Gris": "🐷",
    "Fjäril": "🦋"
  },

  
getQuestionsByLevel() {
  const questionsByLevel = {};

  for (let table = 3; table <= 9; table++) {
    const levelId = `level${table - 2}`;
    const levelQuestions = [];

    for (let i = 3; i <= 9; i++) {
      levelQuestions.push({
        q: `${table} · ${i} =`,
        a: String(table * i)
      });
    }

    questionsByLevel[levelId] = levelQuestions;
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
    return allQuestions;
  }
};

const GAME_MODES = {
  multiplication: MULTIPLICATION_MODE
};
