// ====================
// Configuration
// ====================
const LEVEL_CONFIG = [
  { id: "table3", label: "3", top: "15%", left: "25%", state: "open" },
  { id: "table4", label: "4", top: "15%", left: "53%", state: "locked" },
  { id: "table5", label: "5", top: "10%", left: "75%", state: "locked" },
  { id: "table6", label: "6", top: "36%", left: "67%", state: "locked" },
  { id: "bonusLevel", label: "⭐", top: "20.2%", left: "88.5%", state: "locked", type: "bonus" },
  { id: "table7", label: "7", top: "55%", left: "40%", state: "locked" },
  { id: "table8", label: "8", top: "86%", left: "23%", state: "locked" },
  { id: "table9", label: "9", top: "86%", left: "50%", state: "locked" },
  { id: "finalLevel", label: "🔥", top: "84%", left: "76%", state: "locked" },
];

const RANDOMIZE_QUESTIONS = true;
const FINAL_TEST_DURATION = 3 * 60;
const FINAL_TEST_PASS_SCORE = 18;
const NORMAL_LEVEL_PASS_SCORE = 5;

const STORAGE_KEYS = {
  levelProgress: "levelProgress",
  bonusAnimal: "bonusAnimal",
  starsPlaced: "starsPlaced",
  finalTestBestTime: "finalTestBestTime",
};
const ANIMALS = {
  "Hund": "🐶",
  "Katt": "🐱",
  "Hamster": "🐹",
  "Kanin": "🐰",
  "Gris": "🐷",
  "Fjäril": "🦋"
};

let currentLevel = null;

// ====================
// Level setup
// ====================
function renderLevels() {
  const levelContainer = document.getElementById("levels");

  LEVEL_CONFIG.forEach(level => {
    const levelButton = document.createElement("div");

    levelButton.id = level.id;
    levelButton.classList.add("level", level.state);

    if (level.type === "bonus") {
      levelButton.classList.add("bonus");
    }

    levelButton.textContent = level.label;

    levelButton.style.top = level.top;
    levelButton.style.left = level.left;

    levelContainer.appendChild(levelButton);
  });
}

renderLevels();

const levels = document.querySelectorAll(".level");

// ====================
// Save system
// ====================
function loadProgress() {
  const stored = localStorage.getItem(STORAGE_KEYS.levelProgress);
  if (!stored) return;

  const progress = JSON.parse(stored);
  levels.forEach((level, idx) => {
    level.classList.remove("locked", "open", "done");
    level.classList.add(progress[idx] || "locked");
  });
  const savedAnimal = localStorage.getItem(STORAGE_KEYS.bonusAnimal);
  if (savedAnimal) {
    placeAnimalOnMap(savedAnimal);
    const bonusLevel = document.getElementById("bonusLevel");
    bonusLevel.classList.remove("locked");
    bonusLevel.classList.add("done");
  }
  const starsPlaced = localStorage.getItem(STORAGE_KEYS.starsPlaced);
  if (starsPlaced === "true") {
    placeStarsOnMap();
  }
}

// ====================
// Question generation, create levels 3–9 (each with 3×3 .. 9×9)
// ====================
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

  // Insert extra question set to keep level indexes aligned after the bonus level
  if (table === 7) {
    questionsByLevel.push([...levelQuestions]);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadProgress();

// ====================
// Level progression
// ====================
function completeLevel(idx) {
  const level = levels[idx];
  level.classList.remove("open");
  level.classList.add("done");

  const next = levels[idx + 1];

  // Special unlock rule for table 4
  if (level.id === "table4") {
    document.getElementById("table5").classList.remove("locked");
    document.getElementById("table5").classList.add("open");

    document.getElementById("table6").classList.remove("locked");
    document.getElementById("table6").classList.add("open");

    document.getElementById("table7").classList.remove("locked");
    document.getElementById("table7").classList.add("open");
  }
  else if (["table5", "table6"].includes(level.id)) {
    const bonus = document.getElementById("bonusLevel");
    if (bonus.classList.contains("locked")) {
      bonus.classList.remove("locked");
      bonus.classList.add("open");
    }
  }
  else if (next) {
    next.classList.remove("locked");
    next.classList.add("open");
  }

  saveProgress();
}

function saveProgress() {
  const progress = Array.from(levels).map(level => {
    if (level.classList.contains("done")) return "done";
    if (level.classList.contains("open")) return "open";
    return "locked";
  });
  localStorage.setItem(STORAGE_KEYS.levelProgress, JSON.stringify(progress));

  // Restore saved bonus animal
  const savedAnimal = localStorage.getItem(STORAGE_KEYS.bonusAnimal);
  if (savedAnimal && ANIMALS[savedAnimal]) {
    placeAnimalOnMap(savedAnimal, false);
  }

  // Save stars if they exist
  const starsPlaced = document.querySelectorAll(".star-icon").length > 0;
  localStorage.setItem(STORAGE_KEYS.starsPlaced, starsPlaced ? "true" : "false");
}

// ====================
// Bonus level
// ====================
function openAnimalSelector() {
  const selectHTML = `
    <select id="animalSelect" class="swal2-select">
      <option value="" disabled selected>Välj ett djur</option>
      ${Object.keys(ANIMALS).map(a => `<option value="${a}">${a}</option>`).join("")}
    </select>
  `;

  Swal.fire({
    title: "Bonusnivå 🐾",
    html: selectHTML,
    confirmButtonText: "Placera djur",
    cancelButtonText: "Avbryt",
    showCancelButton: true,
    allowOutsideClick: false,
    width: "40%"
  }).then(result => {
    if (!result.isConfirmed) return;
    const animalType = document.getElementById("animalSelect").value;
    if (!animalType) return;

    placeAnimalOnMap(animalType, true);

    const bonusLevel = document.getElementById("bonusLevel");
    bonusLevel.classList.remove("open");
    bonusLevel.classList.add("done");
    saveProgress();
  });
}

function placeAnimalOnMap(type, save = true) {
  // Remove any existing animal icon before placing a new one
  const oldIcon = document.querySelector(".animal-icon");
  if (oldIcon) oldIcon.remove();

  const pos = { top: "43.5%", left: "12%" };

  const icon = document.createElement("div");
  icon.classList.add("animal-icon");
  icon.textContent = ANIMALS[type];
  icon.style.top = pos.top;
  icon.style.left = pos.left;

  document.querySelector(".map-container").appendChild(icon);

  if (save) {
    localStorage.setItem(STORAGE_KEYS.bonusAnimal, type);
  }
}

// ====================
// Final rewards
// ====================
function placeStarsOnMap() {
  const mapContainer = document.querySelector(".map-container");
  if (!mapContainer) return;

  // Prevent duplicate decorative stars
  if (document.querySelectorAll(".star-icon").length > 0) {
    localStorage.setItem(STORAGE_KEYS.starsPlaced, "true");
    return;
  }

  const starPositions = [
    { top: "5%", left: "5%" },
    { top: "5%", left: "95%" },
    { top: "95%", left: "5%" },
    { top: "95%", left: "95%" },
  ];

  starPositions.forEach(pos => {
    const star = document.createElement("div");
    star.classList.add("star-icon");
    star.textContent = "⭐";
    star.style.top = pos.top;
    star.style.left = pos.left;
    mapContainer.appendChild(star);
  });

  localStorage.setItem(STORAGE_KEYS.starsPlaced, "true");
}

// Generate 20 unique mixed questions evenly from tables 3–9, avoid duplicates and reversed duplicates (e.g. 7×4 vs 4×7)
function getFinalTestQuestions() {
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

function celebrateConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      scalar: 1.6,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// ====================
// Quiz flow
// ====================
function getQuizTitle(currentElement) {
  if (currentElement.id === "finalLevel") {
    return "Finaltest 🏁";
  }

  return `Tabell ${questionsByLevel[currentLevel][0].q
    .split("·")[0]
    .trim()}`;
}

function getInstructionText(currentElement) {
  if (currentElement.id === "finalLevel") {
    return `Du behöver ${FINAL_TEST_PASS_SCORE} rätt för att klara nivån.`;
  }
  return `Du behöver ${NORMAL_LEVEL_PASS_SCORE} rätt för att klara nivån.`;
}

function buildQuizHTML(currentElement, questions) {
  const isFinalLevel = currentElement.id === "finalLevel";

  let quizHTML = isFinalLevel
    ? `
      <div class="final-test-timer">
        Tid kvar: <span id="finalTestTimer">03:00</span>
      </div>
      <form id="quizForm"><div class="quiz-grid-final">`
    : `<form id="quizForm"><div class="quiz-grid-single">`;

  questions.forEach((question, index) => {
    quizHTML += `
      <div class="quiz-item">
        <label class="quiz-question">${question.q}</label>
        <input type="text" name="q${index}" data-answer="${question.a}" maxlength="3" class="quiz-input" required>
      </div>
    `;
  });

  quizHTML += "</div></form>";

  return quizHTML;
}

function checkAnswers() {
  const inputs = Swal.getHtmlContainer().querySelectorAll("input[data-answer]");
  const answers = [];
  let correctCount = 0;

  inputs.forEach(input => {
    const userAnswer = input.value.trim();
    const correctAnswer = input.dataset.answer.trim();
    const isCorrect = userAnswer === correctAnswer;

    answers.push({
      q: input.previousElementSibling.textContent,
      user: userAnswer,
      correct: correctAnswer,
      isCorrect
    });

    if (isCorrect) correctCount++;
  });

  return { answers, correctCount };
}

function buildFeedbackHTML(wrongAnswers) {
  if (wrongAnswers.length === 0) {
    return "<p>Alla rätt! 🎉</p>";
  }

  return `
    <div class="feedback-list">
      <p>Tänk på till nästa gång:</p>
      ${wrongAnswers
      .map(answer => `
          <div>
            ${answer.q}
            <b style="color:green">${answer.correct}</b>
          </div>
        `)
      .join("")}
    </div>
  `;
}

function startQuiz() {
  const currentElement = levels[currentLevel];
  const isFinalLevel = currentElement.id === "finalLevel";
  let questions;

  if (isFinalLevel) {
    questions = getFinalTestQuestions();
  } else {
    questions = questionsByLevel[currentLevel].slice(); // copy to avoid mutation
  }

  if (RANDOMIZE_QUESTIONS) shuffleArray(questions);

  const quizHTML = buildQuizHTML(currentElement, questions);

  const titleText = getQuizTitle(currentElement);
  const instructionText = getInstructionText(currentElement);

  let timeRemaining = FINAL_TEST_DURATION;
  let timerInterval;

  // Open quiz popup
  Swal.fire({
    title: titleText,
    html: `
      <p class="quiz-instruction">${instructionText}</p>
      ${quizHTML}
    `,
    focusConfirm: false,
    showCancelButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: "Rätta",
    cancelButtonText: "Avbryt",
    width: isFinalLevel ? "60%" : "40%",
    customClass: { popup: "quiz-popup" },
    didOpen: () => {
      if (isFinalLevel) {
        const timerEl = Swal.getHtmlContainer().querySelector("#finalTestTimer");
        timerInterval = setInterval(() => {
          timeRemaining--;
          const min = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
          const sec = (timeRemaining % 60).toString().padStart(2, "0");
          if (timerEl) timerEl.textContent = `${min}:${sec}`;

          if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            Swal.close();
            Swal.fire({
              title: "Bra försök, testa igen!",
              html: "Tiden är ute.",
              icon: "question",
              confirmButtonText: "OK",
              width: "60%"
            });
          }
        }, 1000);
      }
    },
    preConfirm: () => checkAnswers()
  }).then(result => {
    if (!result.isConfirmed) {
      if (isFinalLevel) {
        clearInterval(timerInterval);
      }
      return;
    }
    const { answers, correctCount } = result.value;
    if (isFinalLevel) {
      clearInterval(timerInterval);
    }

    const requiredCorrect = isFinalLevel
      ? FINAL_TEST_PASS_SCORE
      : NORMAL_LEVEL_PASS_SCORE;

    const passed = correctCount >= requiredCorrect;

    const level = levels[currentLevel];
    const isAlreadyDone = level.classList.contains("done");

    let popupTitle = passed ? "Snyggt jobbat!" : "Bra försök, testa igen!";
    let textBody = "";
    let feedbackHTML = "";

    const wrongAnswers = answers.filter(a => !a.isCorrect);

    if (passed) {
      if (isFinalLevel) {
        const timeUsed = FINAL_TEST_DURATION - timeRemaining;
        const previousBest = localStorage.getItem(STORAGE_KEYS.finalTestBestTime);

        if (!previousBest) {
          textBody = "🎉 Du har klarat hela spelet! Grattis!"; // First pass
          localStorage.setItem(STORAGE_KEYS.finalTestBestTime, timeUsed);
          celebrateConfetti();
        } else {
          const bestTime = parseInt(previousBest);
          if (timeUsed < bestTime) {
            textBody = `🎉 Du klarade finaltestet igen, ${bestTime - timeUsed} sekunder snabbare än ditt rekord!`;
            localStorage.setItem(STORAGE_KEYS.finalTestBestTime, timeUsed);
            celebrateConfetti();
          } else if (timeUsed === bestTime) {
            textBody = `🎉 Du klarade finaltestet igen, på samma tid som ditt rekord!`;
          } else {
            textBody = `🎉 Du klarade finaltestet igen!`;
          }
        }
        placeStarsOnMap();

      } else if (isAlreadyDone) {
        textBody = "Du klarade nivån igen.";
      } else {
        textBody = "Du har låst upp en ny nivå.";
      }
    } else {
      textBody = "Inte riktigt där än.";
    }

    feedbackHTML = buildFeedbackHTML(wrongAnswers);

    // Show popup
    Swal.fire({
      title: popupTitle,
      html: `<p>${textBody}</p><hr>${feedbackHTML}`,
      icon: passed ? "success" : "question",
      confirmButtonText: "OK",
      width: isFinalLevel ? "60%" : "40%",
      allowOutsideClick: false
    }).then(() => {
      if (passed && !isAlreadyDone) completeLevel(currentLevel);
    });

  });
}


// ====================
// Dev helper (Cheat: fill answers when a key combo is pressed)
// ====================
(function () {
  const SEQ = ["ArrowLeft", "ArrowRight", "ArrowRight", "ArrowLeft"];
  let buffer = [];

  function doCheatFill() {
    const container = Swal.getHtmlContainer();
    if (!container) {
      console.log("No quiz popup is open.");
      return;
    }

    const inputs = container.querySelectorAll("input[data-answer]");
    if (!inputs.length) {
      console.log("No quiz inputs found.");
      return;
    }

    inputs.forEach(input => {
      input.value = input.dataset.answer;
      input.classList.add("cheat-filled");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  // Listen for cheat code sequence
  window.addEventListener("keydown", function (e) {
    const keyId = e.code || ("Key" + (e.key || "").toUpperCase());
    buffer.push(keyId);
    if (buffer.length > SEQ.length) buffer.shift();

    if (buffer.length === SEQ.length) {
      let match = true;
      for (let i = 0; i < SEQ.length; i++) {
        if (buffer[i] !== SEQ[i]) {
          match = false;
        }
      }
      if (match) {
        buffer = [];
        e.preventDefault();
        doCheatFill();
      }
    }
  }, true);
})();

// ====================
// Event listeners
// ====================
levels.forEach((level, idx) => {
  level.addEventListener("click", () => {
    if (level.classList.contains("open") || level.classList.contains("done")) {
      currentLevel = idx;
      if (level.classList.contains("bonus")) {
        openAnimalSelector();
      } else {
        startQuiz();
      }
    }
  });
});

const resetProgressButton = document.getElementById("resetProgressButton");
resetProgressButton.addEventListener("click", () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  location.reload();
});
