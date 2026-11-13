function getStorageKeys() {
  const modeKey =
    GAME_MODE === "addition" || GAME_MODE === "subtraction"
      ? `${GAME_MODE}_${GAME_DIFFICULTY === "10" ? "10" : "20"}`
      : GAME_MODE;

  return {
    levelProgress: `${modeKey}_levelProgress`,
    bonusAnimal: `${modeKey}_bonusAnimal`,
    finalTestBestTime: `${modeKey}_finalTestBestTime`,
  };
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
    placeAnimalOnMap(savedAnimal, false);
    const bonusLevel = document.getElementById("bonusLevel");
    bonusLevel.classList.remove("locked");
    bonusLevel.classList.add("done");
  }
if (
  GAME_CONFIG.reunionPosition &&
  savedAnimal &&
  document.getElementById("finalLevel")?.classList.contains("done")
) {
  placeReunionDuplicate();

  const duplicate = document.querySelector(".reunion-duplicate");

  if (duplicate) {
    duplicate.style.top = GAME_CONFIG.reunionPosition.destination.top;
    duplicate.style.left = GAME_CONFIG.reunionPosition.destination.left;
  }

  placeReunionHeart();
}
}


function saveProgress() {
  const progress = Array.from(levels).map(level => {
    if (level.classList.contains("done")) return "done";
    if (level.classList.contains("open")) return "open";
    return "locked";
  });
  localStorage.setItem(STORAGE_KEYS.levelProgress, JSON.stringify(progress));
}

const resetProgressButton = document.getElementById("resetProgressButton");

resetProgressButton.addEventListener("click", async () => {
  const modeNames = {
    addition: "addition",
    subtraction: "subtraktion",
    multiplication: "multiplikation",
    division: "division"
  };

  const result = await Swal.fire({
    title: "Radera framsteg?",
    text: `Vill du radera dina framsteg i ${modeNames[GAME_MODE]}? Du kan inte ångra detta.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ja, radera",
    cancelButtonText: "Avbryt",
    confirmButtonColor: "#d33",
    reverseButtons: false
  });

  if (!result.isConfirmed) return;

  // Delete progress for the selected operation only
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));

  // Refresh the current adventure
  switchGameMode(GAME_MODE);
});