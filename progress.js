function getStorageKeys() {
  return {
    levelProgress: `${GAME_MODE}_levelProgress`,
    bonusAnimal: `${GAME_MODE}_bonusAnimal`,
    starsPlaced: `${GAME_MODE}_starsPlaced`,
    finalTestBestTime: `${GAME_MODE}_finalTestBestTime`,
  };
}

function migrateLegacyProgress() {
  if (GAME_MODE !== "multiplication") return;

  const legacyKeys = {
    levelProgress: "levelProgress",
    bonusAnimal: "bonusAnimal",
    starsPlaced: "starsPlaced",
    finalTestBestTime: "finalTestBestTime",
  };

  Object.entries(legacyKeys).forEach(([key, oldKey]) => {
    const newKey = STORAGE_KEYS[key];
    const savedValue = localStorage.getItem(oldKey);

    if (savedValue !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, savedValue);
    }
  });
}

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


const resetProgressButton = document.getElementById("resetProgressButton");

resetProgressButton.addEventListener("click", () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));

  if (GAME_MODE === "multiplication") {
    [
      "levelProgress",
      "bonusAnimal",
      "starsPlaced",
      "finalTestBestTime"
    ].forEach(key => localStorage.removeItem(key));
  }

  switchGameMode(GAME_MODE);
});
