// ====================
// Question generation, create levels 3–9 (each with 3×3 .. 9×9)
// ====================
const MULTIPLICATION_MODE = {
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
