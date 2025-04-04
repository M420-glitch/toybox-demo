document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();
});

function chooseDrop(choice) {
  const box = document.getElementById("result-box");
  const text = document.getElementById("result-text");

  text.innerHTML = `You chose to: <strong>${choice}</strong>.<br><br>The route’s yours now. Drop it. Leave no trace. Watch what cracks.`;
  box.style.display = "block";

  if (!window._xpAdded) {
    window._xpAdded = true;
    if (!playerState.isCompleted("17")) {
      let currentXP = playerState.getXP();
      currentXP += 5;
      playerState.setXP(currentXP);
      playerState.markCompleted("17");
      xpEl.textContent = currentXP;
    
      xpEl.classList.add('xp-flash');
      setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
    }
    
    document.getElementById("xp-value").textContent = playerState.getXP();
  }
}

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
