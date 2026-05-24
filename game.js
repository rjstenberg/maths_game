const levels = document.querySelectorAll('.level');

const FINAL_TEST_BEST_TIME_KEY = "finalTestBestTime";

const animals = {
  "Hund": "🐶",
  "Katt": "🐱",
  "Hamster": "🐹",
  "Kanin": "🐰",
  "Gris": "🐷",
  "Fjäril": "🦋"
};

function loadProgress() {
    const stored = localStorage.getItem('levelProgress');
    if (!stored) return; // no saved progress

    const progress = JSON.parse(stored);
    levels.forEach((lvl, idx) => {
      lvl.classList.remove('locked','open','done');
      lvl.classList.add(progress[idx] || 'locked');
    });
    const savedAnimal = localStorage.getItem("bonusAnimal");
    if (savedAnimal) {
      placeAnimalOnMap(savedAnimal);
      const bonusLvl = document.getElementById("levelBonus");
      bonusLvl.classList.remove("locked");
      bonusLvl.classList.add("done");
    }
  const starsPlaced = localStorage.getItem("starsPlaced");
  if (starsPlaced === "true")
  {
    placeStarsOnMap();
  }
}

// Call it once after defining levels
loadProgress();

    let currentLevel = null;
    // Toggle: set true to shuffle questions for each level, false to keep original order
    const RANDOMIZE_QUESTIONS = true;

  // create levels 3–9 (each with 3×3 .. 9×9)
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

  // duplicate table 7
  if (table === 7) {
    questionsByLevel.push([...levelQuestions]);
  }
}

function shuffleArray(arr) {
  // in-place shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

    // Attach click listeners
    levels.forEach((lvl, idx) => {
      lvl.addEventListener('click', () => {
    if (lvl.classList.contains('open') || lvl.classList.contains('done')) {
          currentLevel = idx;
          if (lvl.classList.contains('bonus')) {
      openAnimalSelector();
    } else {
      startQuiz();
    }
        }
      });
    });

function completeLevel(idx) {
  const lvl = levels[idx];
  lvl.classList.remove('open');
  lvl.classList.add('done');

  const next = levels[idx+1];

  // special rule
  if (lvl.id == "level2") {
    document.getElementById("level3").classList.remove('locked');
    document.getElementById("level3").classList.add('open');

    document.getElementById("level4").classList.remove('locked');
    document.getElementById("level4").classList.add('open');

    document.getElementById("level5").classList.remove('locked');
    document.getElementById("level5").classList.add('open');
  }
  else if (lvl.id === "level3" || lvl.id === "level4")
  {
    const bonus = document.getElementById("levelBonus");
    if (bonus.classList.contains("locked")) {
      bonus.classList.remove("locked");
      bonus.classList.add("open");
    }
  }
  else if (next) 
  { 
    next.classList.remove('locked');
    next.classList.add('open');
  }

  // Save progress to localStorage
  saveProgress();
}

function saveProgress() {
  //Each level's state
  const progress = Array.from(levels).map(lvl => {
    if (lvl.classList.contains('done')) return 'done';
    if (lvl.classList.contains('open')) return 'open';
    return 'locked';
  });
  localStorage.setItem('levelProgress', JSON.stringify(progress));

  //Placed animal
    const animalIcon = document.querySelector('.animal-icon');
  if (animalIcon) {
    // Find the emoji -> convert back to animal name if possible
    const emoji = animalIcon.textContent.trim();
    const animalName = animals[emoji] || emoji;
const savedAnimal = localStorage.getItem("bonusAnimal");
if (savedAnimal && animals[savedAnimal]) {
  placeAnimalOnMap(savedAnimal, false);
}  }

  // --- Save stars if they exist ---
  const starsPlaced = document.querySelectorAll('.star-icon').length > 0;
  localStorage.setItem('starsPlaced', starsPlaced ? 'true' : 'false');
}


function openAnimalSelector() {
  const selectHTML = `
    <select id="animalSelect" class="swal2-select">
      <option value="" disabled selected>Välj ett djur</option>
      ${Object.keys(animals).map(a => `<option value="${a}">${a}</option>`).join('')}
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
    const animalType = document.getElementById('animalSelect').value;
    if (!animalType) return;

    placeAnimalOnMap(animalType, true); // true = save it
    //Swal.fire("Kul!", "Ditt djur har lagts till på kartan!", "success",);
    

    const bonusLvl = document.getElementById("levelBonus");
    bonusLvl.classList.remove('open');
    bonusLvl.classList.add('done');
    saveProgress?.();
  });
}
function placeAnimalOnMap(type, save = true) {
  // Remove any existing animal icon before placing a new one
  const oldIcon = document.querySelector(".animal-icon");
  if (oldIcon) oldIcon.remove();

  const pos = {top: "43.5%", left: "12%"};

  const icon = document.createElement("div");
  icon.classList.add("animal-icon");
  icon.textContent = animals[type];
  icon.style.position = "absolute";
  icon.style.top = pos.top;
  icon.style.left = pos.left;
  icon.style.fontSize = "3rem";
  icon.style.transform = "translate(-50%, -50%)";
  icon.style.pointerEvents = "none";
  icon.style.zIndex = "50";

  document.querySelector(".map-container").appendChild(icon);

  // Save to localStorage
  if (save) {
    localStorage.setItem("bonusAnimal", type);
  }
}

function placeStarsOnMap() {
  const mapContainer = document.querySelector(".map-container");
  if (!mapContainer) return;

  // Prevent duplicate decorative stars
  if (document.querySelectorAll(".star-icon").length > 0) {
    localStorage.setItem("starsPlaced", "true");
    return;
  }

  const starPositions = [
    { top: "5%", left: "5%" },
    { top: "5%", left: "95%" },
    { top: "95%", left: "5%" },
    { top: "95%", left: "95%" },
  ];

  // Add stars
  starPositions.forEach(pos => {
    const star = document.createElement("div");
    star.classList.add("star-icon");
    star.textContent = "⭐";
    star.style.position = "absolute";
    star.style.top = pos.top;
    star.style.left = pos.left;
    star.style.transform = "translate(-50%, -50%)";
    star.style.fontSize = "3rem";
    star.style.pointerEvents = "none";
    star.style.zIndex = "50";
    mapContainer.appendChild(star);
  });

  localStorage.setItem("starsPlaced", "true");
}

// --- Generate 20 unique mixed questions evenly from tables 3–9 ---
// Avoids duplicates and reversed duplicates (e.g. 7×4 vs 4×7)
function getFinalTestQuestions() {
  const uniquePairs = new Set();
  const allQuestions = [];

  for (let a = 3; a <= 9; a++) {
    for (let b = 3; b <= 9; b++) {
      // create a normalized key so (4,7) == (7,4)
      const key = [Math.min(a, b), Math.max(a, b)].join('×');
      if (!uniquePairs.has(key)) {
        uniquePairs.add(key);
        allQuestions.push({
          q: `${a} · ${b} =`,
          a: String(a * b)
        });
      }
    }
  }

  // shuffle all unique combinations
  shuffleArray(allQuestions);

  // pick first 20 for the final test
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
      scalar: 1.6,  // ← Increase size here (1 = default)
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}


function startQuiz() {
  const currentElement = levels[currentLevel]; // current level DOM element
  let questions;

  // --- Select questions ---
  if (currentElement.id === "level8") {
    // Final test: 20 unique questions from 3–9 tables
    questions = getFinalTestQuestions();
  } else {
    // Regular level
    questions = questionsByLevel[currentLevel].slice(); // copy to avoid mutation
  }

  // Optionally shuffle
  if (RANDOMIZE_QUESTIONS) shuffleArray(questions);

    // --- Build quiz HTML ---
  let quizHTML;
  if (currentElement.id === "level8") {
    // Final test: 4 columns + timer
    quizHTML = `
      <div style="margin-bottom:10px; font-weight:bold;">
        Tid kvar: <span id="finalTestTimer">03:00</span>
      </div>
      <form id='quizForm'><div class='quiz-grid-final'>`;
  } else {
    // Regular levels: 1 column
    quizHTML = "<form id='quizForm'><div class='quiz-grid-single'>";
  }

  questions.forEach((q, i) => {
    quizHTML += `
      <div class="quiz-item">
        <label class="quiz-question">${q.q}</label>
        <input type="text" name="q${i}" data-answer="${q.a}" maxlength="3" class="quiz-input" required>
      </div>
    `;
  });

  quizHTML += "</div></form>";

  // --- Title and instruction text ---
  let titleText = currentElement.id === "level8" ? "Finaltest 🏁" : `Tabell ${questionsByLevel[currentLevel][0].q.split("·")[0].trim()}`;
  let instructionText = currentElement.id === "level8" ? "Du behöver 18 rätt för att klara nivån." : "Du behöver 5 rätt för att klara nivån.";

  // --- Timer setup for final test ---
  let timeRemaining = 3 * 60; // 3 minutes in seconds
  let timerInterval;

  // --- Show SweetAlert2 quiz popup ---
  Swal.fire({
    title: titleText,
    html: `
      <p style="margin-top:-5px; font-size: 0.95em; color: #555;">${instructionText}</p>
      ${quizHTML}
    `,
    focusConfirm: false,
    showCancelButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: "Rätta",
    cancelButtonText: 'Avbryt',
    width: currentElement.id === "level8" ? '60%' : '40%',
    customClass: { popup: 'quiz-popup' },
        didOpen: () => {
      // Start timer if final test
      if (currentElement.id === "level8") {
        const timerEl = Swal.getHtmlContainer()?.querySelector("#finalTestTimer");
        timerInterval = setInterval(() => {
          timeRemaining--;
          const min = Math.floor(timeRemaining / 60).toString().padStart(2,'0');
          const sec = (timeRemaining % 60).toString().padStart(2,'0');
          if (timerEl) timerEl.textContent = `${min}:${sec}`;

          if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            Swal.close();
            Swal.fire({
              title: "Bra försök, testa igen!",
              html: "Tiden är ute.",
              icon: "question",
              confirmButtonText: "OK",
              width: '60%'
            });
          }
        }, 1000);
      }
    },
    preConfirm: () => {
      const inputs = Swal.getHtmlContainer().querySelectorAll("input[data-answer]");
      const answers = [];
      let correctCount = 0;

      inputs.forEach(inp => {
        const user = inp.value.trim();
        const correct = inp.dataset.answer.trim();
        const isCorrect = user === correct;
        answers.push({ q: inp.previousElementSibling.textContent, user, correct, isCorrect });
        if (isCorrect) correctCount++;
      });

      return { answers, correctCount };
    }
  }).then(result => {
    if (!result.isConfirmed) {
          if (currentElement.id === "level8") clearInterval(timerInterval);
    return;
    }
    const { answers, correctCount } = result.value;
    // --- Stop timer ---
    if (currentElement.id === "level8") clearInterval(timerInterval);

    // --- Determine passing threshold ---
    const requiredCorrect = currentElement.id === "level8" ? 18 : 5;
    const passed = correctCount >= requiredCorrect;

    const level = levels[currentLevel];
    const isAlreadyDone = level.classList.contains('done');

    let popupTitle = passed ? "Snyggt jobbat!" : "Bra försök, testa igen!";
let textBody = "";       // Motivational message
let feedbackHTML = "";   // Feedback section

const wrongAnswers = answers.filter(a => !a.isCorrect);

// --- Determine motivational text first ---
if (passed) {
  if (currentElement.id === "level8") {
    // Final test
    const timeUsed = 3*60 - timeRemaining;
    const previousBest = localStorage.getItem("finalTestBestTime");

    if (!previousBest) {
      textBody = "🎉 Du har klarat hela spelet! Grattis!"; // First pass
      localStorage.setItem("finalTestBestTime", timeUsed);
      celebrateConfetti();
    } else {
      const bestTime = parseInt(previousBest);
      if (timeUsed < bestTime) {
        textBody = `🎉 Du klarade finaltestet igen, ${bestTime - timeUsed} sekunder snabbare än ditt rekord!`;
        localStorage.setItem("finalTestBestTime", timeUsed);
        celebrateConfetti();
      } else if (timeUsed === bestTime) {
        textBody = "🎉 Du klarade finaltestet igen, på samma tid som ditt rekord!";
      } else {
        textBody = `🎉 Du klarade finaltestet igen!`;
      }
    }
    placeStarsOnMap();

  } else if (isAlreadyDone) {
    // Normal level already done
    textBody = "Du klarade nivån igen.";
  } else {
    // Normal level first pass
    //if (currentElement.id === "level2" ) {
     // textBody = "Du har låst upp tre nivåer.";
    //} else {
      textBody = "Du har låst upp en ny nivå.";
    //}
  }

} else {
  // Did not pass
  textBody = "Inte riktigt där än.";
}

// --- Build feedback separately ---
if (wrongAnswers.length === 0) {
  feedbackHTML = "<p>Alla rätt! 🎉</p>";
} else {
  feedbackHTML = "<div class='feedback-list'><p>Tänk på till nästa gång:</p>" +
    wrongAnswers.map(a => `<div>${a.q} <b style="color:green">${a.correct}</b></div>`).join("") +
    "</div>";
}

// --- Show popup ---
Swal.fire({
  title: popupTitle,
  html: `<p>${textBody}</p><hr>${feedbackHTML}`,
  icon: passed ? "success" : "question",
  confirmButtonText: "OK",
  width: currentElement.id === "level8" ? '60%' : '40%',
  allowOutsideClick: false
}).then(() => {
  if (passed && !isAlreadyDone) completeLevel(currentLevel);
});

  });
}



// Cheat: fill answers when a key combo is pressed
(function() {
  const SEQ = ['ArrowLeft','ArrowRight','ArrowRight','ArrowLeft'];
  let buffer = [];

  function doCheatFill() {
  const container = Swal.getHtmlContainer?.();
  if (!container) {
    console.log('No quiz popup is open.');
    return;
  }

  const inputs = container.querySelectorAll('input[data-answer]');
  if (!inputs.length) {
    console.log('No quiz inputs found.');
    return;
  }

  inputs.forEach(inp => {
    inp.value = inp.dataset.answer;        // fill correct answer
    inp.style.backgroundColor = '#c8f7c5'; // highlight in light green
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
 // Add the Cheat button dynamically
 /*
    const cheatBtn = document.createElement('button');
    cheatBtn.innerText = 'Cheat';
    cheatBtn.style = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      padding: 6px 12px;
      background: orange;
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      z-index: 9999;
    `;
    cheatBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent SweetAlert2 from closing the popup
      doCheatFill();
    });
    document.body.appendChild(cheatBtn);
    */
  // Capture key sequence
  window.addEventListener('keydown', function(e) {
    const keyId = e.code || ('Key' + (e.key || '').toUpperCase());
    buffer.push(keyId);
    if (buffer.length > SEQ.length) buffer.shift();

    if (buffer.length === SEQ.length) {
      let match = true;
      for (let i = 0; i < SEQ.length; i++) if (buffer[i] !== SEQ[i]) match = false;
      if (match) {
        buffer = [];
        e.preventDefault?.();
        doCheatFill();
      }
    }
  }, true);
})();