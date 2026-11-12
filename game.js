// ====================
// Configuration
// ====================
const GAME_MODES = {
  addition: ADDITION_MODE,
  subtraction: SUBTRACTION_MODE,
  multiplication: MULTIPLICATION_MODE,
  division: DIVISION_MODE
};

let GAME_MODE = "multiplication";
let GAME_CONFIG = GAME_MODES[GAME_MODE];

let LEVEL_CONFIG = GAME_CONFIG.levels;

let RANDOMIZE_QUESTIONS = GAME_CONFIG.settings.randomizeQuestions;
let FINAL_TEST_DURATION = GAME_CONFIG.settings.finalTestDuration;
let FINAL_TEST_PASS_SCORE = GAME_CONFIG.settings.finalTestPassScore;
let NORMAL_LEVEL_PASS_SCORE = GAME_CONFIG.settings.normalLevelPassScore;

let STORAGE_KEYS = getStorageKeys();

let ANIMALS = GAME_CONFIG.animals;

let currentLevel = null;

// ====================
// Level setup
// ====================
function renderLevels() {
  const levelContainer = document.getElementById("levels");
  levelContainer.innerHTML = "";

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

let levels = document.querySelectorAll(".level");

let questionsByLevel = GAME_CONFIG.getQuestionsByLevel();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadProgress();


function switchGameMode(mode) {
  GAME_MODE = mode;
  GAME_CONFIG = GAME_MODES[mode];

  document.getElementById("gameMap").src = GAME_CONFIG.map;

  LEVEL_CONFIG = GAME_CONFIG.levels;
  RANDOMIZE_QUESTIONS = GAME_CONFIG.settings.randomizeQuestions;
  FINAL_TEST_DURATION = GAME_CONFIG.settings.finalTestDuration;
  FINAL_TEST_PASS_SCORE = GAME_CONFIG.settings.finalTestPassScore;
  NORMAL_LEVEL_PASS_SCORE = GAME_CONFIG.settings.normalLevelPassScore;

  STORAGE_KEYS = getStorageKeys();
  ANIMALS = GAME_CONFIG.animals;

  currentLevel = null;

  document.querySelectorAll(".animal-icon, .star-icon").forEach(icon => icon.remove());

  renderLevels();
  levels = document.querySelectorAll(".level");
  questionsByLevel = GAME_CONFIG.getQuestionsByLevel();

  attachLevelListeners();
  loadProgress();
}


// ====================
// Level progression
// ====================

function completeLevel(idx) {
  const level = levels[idx];

  level.classList.remove("open");
  level.classList.add("done");

  const levelsToUnlock = GAME_CONFIG.unlocks[level.id] || [];

  levelsToUnlock.forEach(levelId => {
    const nextLevel = document.getElementById(levelId);

    if (nextLevel && nextLevel.classList.contains("locked")) {
      nextLevel.classList.remove("locked");
      nextLevel.classList.add("open");
    }
  });

  saveProgress();
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
    width: "min(95vw, 650px)"
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

  const pos = GAME_CONFIG.animalPosition;

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

function getFinalTestQuestions() {
  const questions = GAME_CONFIG.getFinalTestQuestions();
  shuffleArray(questions);
  return questions.slice(0, 20);
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
    return GAME_CONFIG.levels[currentLevel].title;
}

function getRequiredScore(questionCount) {
  return NORMAL_LEVEL_PASS_SCORE < 1
    ? Math.ceil(questionCount * NORMAL_LEVEL_PASS_SCORE)
    : NORMAL_LEVEL_PASS_SCORE;
}

function getInstructionText(currentElement, questionCount) {
  if (currentElement.id === "finalLevel") {
    return `Du behöver ${FINAL_TEST_PASS_SCORE} rätt för att klara nivån.`;
  }

  const requiredCorrect = getRequiredScore(questionCount);
  return `Du behöver ${requiredCorrect} rätt för att klara nivån.`;
}

function buildQuizHTML(currentElement, questions) {
  const isFinalLevel = currentElement.id === "finalLevel";

  const minutes = Math.floor(FINAL_TEST_DURATION / 60);
  const seconds = FINAL_TEST_DURATION % 60;
  const initialTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  let quizHTML = isFinalLevel
    ? `
      <div class="final-test-timer">
        Tid kvar: <span id="finalTestTimer">${initialTime}</span>
      </div>
      <form id="quizForm"><div class="quiz-grid-final">`
    : `<form id="quizForm"><div class="quiz-grid-single">`;

  questions.forEach((question, index) => {
    quizHTML += `
      <div class="quiz-item">
        <label class="quiz-question">${question.q}</label>
        <input type="text" inputmode="numeric" pattern="[0-9]*"
          autocomplete="off" name="q${index}"
          data-answer="${question.a}" maxlength="3"
          class="quiz-input" required>
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
    questions = questionsByLevel[currentElement.id].slice();

    if (RANDOMIZE_QUESTIONS) {
      shuffleArray(questions);
    }

    questions = questions.slice(0, 10);
  }

  const quizHTML = buildQuizHTML(currentElement, questions);

  const titleText = getQuizTitle(currentElement);
  const instructionText = getInstructionText(currentElement, questions.length);

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
    width: isFinalLevel ? "min(96vw, 850px)" : "min(95vw, 650px)",
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
              width: "min(95vw, 650px)"
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
      : getRequiredScore(questions.length);

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
          textBody = "🎉 Du har klarat mästarprovet! Grattis!"; // First pass
          localStorage.setItem(STORAGE_KEYS.finalTestBestTime, timeUsed);
          celebrateConfetti();
        } else {
          const bestTime = parseInt(previousBest);
          if (timeUsed < bestTime) {
            textBody = `🎉 Du klarade mästarprovet igen, ${bestTime - timeUsed} sekunder snabbare än ditt rekord!`;
            localStorage.setItem(STORAGE_KEYS.finalTestBestTime, timeUsed);
            celebrateConfetti();
          } else if (timeUsed === bestTime) {
            textBody = `🎉 Du klarade mästarprovet igen, på samma tid som ditt rekord!`;
          } else {
            textBody = `🎉 Du klarade mästarprovet igen!`;
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
      width: isFinalLevel ? "min(96vw, 850px)" : "min(95vw, 650px)",
      allowOutsideClick: false
    }).then(() => {
      if (passed && !isAlreadyDone) completeLevel(currentLevel);
    });

  });
}


// ====================
// Developer testing shortcut
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

function attachLevelListeners() {
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
}

attachLevelListeners();


// ====================
// Screen navigation
// ====================
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");

document.querySelectorAll(".mode-button").forEach(button => {
  button.addEventListener("click", () => {
    switchGameMode(button.dataset.mode);

    homeScreen.hidden = true;
    gameScreen.hidden = false;
  });
});

document.getElementById("homeButton").addEventListener("click", () => {
  gameScreen.hidden = true;
  homeScreen.hidden = false;
});
