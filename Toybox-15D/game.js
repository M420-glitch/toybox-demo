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

  if (chosenSeed === "Quiet Crack" && chosenEnv === "Truth Kerosene") {
    message = "🧨 You burned clean. A hidden fuse lit the way forward.";
    image = "assets/images/burn-clean.png";
  } else if (chosenSeed === "Anger Spark" && chosenEnv === "System Gaslight") {
    message = "💢 Rage met illusion. You set off the chain reaction.";
    image = "assets/images/explode-loop.png";
  } else if (chosenSeed === "Fame Bomb" || chosenEnv === "Applause Fumes") {
    message = "💥 Spectacular flash. No fire left for the truth.";
    image = "assets/images/fame-burnout.png";
  } else {
    message = "🔥 Sparks flew… but fizzled. It wasn’t ready to catch.";
    image = "assets/images/spark-fail.png";
  }

  result.textContent = message;
  img.src = image;
  document.getElementById("result-area").style.display = "block";

  if (!window._xpAdded) {
    window._xpAdded = true;
    if (!playerState.isCompleted("15D")) {
      let currentXP = playerState.getXP();
      currentXP += 5;
      playerState.setXP(currentXP);
      playerState.markCompleted("15D");
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
