let chosenSeed = null;
let chosenEnv = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();
});

function chooseSeed(seed) {
  chosenSeed = seed;
  document.getElementById("step-1").style.display = "none";
  document.getElementById("step-2").style.display = "block";
}

function chooseEnv(env) {
  chosenEnv = env;
  document.getElementById("step-2").style.display = "none";
  showResult();
}

function showResult() {
  const result = document.getElementById("result-message");
  const img = document.getElementById("growth-image");
  let message = "";
  let image = "";

  if (chosenSeed === "Quick Sprout" && chosenEnv === "Sun & Soil") {
    message = "🌱 Fast growth… but weak roots. Short-lived.";
    image = "assets/images/quick-weak.png";
  } else if (chosenSeed === "Slow Root" && chosenEnv === "Dark Vault") {
    message = "🌳 Slow and hidden… but lasting legacy. You built a future.";
    image = "assets/images/slow-strong.png";
  } else if (chosenSeed === "Greed Bloom" || chosenEnv === "Barren Hype") {
    message = "💀 It bloomed fast and burned faster. Nothing remains.";
    image = "assets/images/burned-out.png";
  } else {
    message = "🌿 Growth… but fragile. Needs more time.";
    image = "assets/images/neutral-grow.png";
  }

  result.textContent = message;
  img.src = image;
  document.getElementById("result-area").style.display = "block";

  if (!window._xpAdded) {
    window._xpAdded = true;
    if (!playerState.isCompleted("15A")) {
      let currentXP = playerState.getXP();
      currentXP += 5;
      playerState.setXP(currentXP);
      playerState.markCompleted("15A");
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
