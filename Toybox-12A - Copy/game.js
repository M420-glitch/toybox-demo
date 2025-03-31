const xpValue = document.getElementById("xp-value");
const visitedList = document.getElementById("visited-list");

// Load XP and visited toyboxes from playerState
window.addEventListener("DOMContentLoaded", () => {
  playerState.load();

  xpValue.textContent = playerState.xp;

  visitedList.innerHTML = playerState.visited.length
    ? playerState.visited.map(v => `<li>${v}</li>`).join("")
    : "<li>None yet.</li>";
});

// Navigation
function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}

function goBack() {
  window.location.href = "../Toybox-11A/index.html";
}

function goHome() {
  window.location.href = "../Toybox-1/index.html";
}
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();
});
