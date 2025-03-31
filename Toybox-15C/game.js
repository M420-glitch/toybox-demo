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

  if (chosenSeed === "Flash Token" && chosenEnv === "Layer Zero") {
    message = "⚡ Instant buzz. Zero consensus. It failed the audit.";
    image = "assets/images/flash-crash.png";
  } else if (chosenSeed === "Root Chain" && chosenEnv === "Cold Vault") {
    message = "🔗 Deep trust. Stored slow. Immutable. Built to last.";
    image = "assets/images/root-chain.png";
  } else if (chosenSeed === "Pump Coin" || chosenEnv === "Hype Pool") {
    message = "📉 It pumped. Then dumped. Reputation lost forever.";
    image = "assets/images/pump-dump.png";
  } else {
    message = "🌀 Some data persisted. But without proof, it faded.";
    image = "assets/images/data-fade.png";
  }

  result.textContent = message;
  img.src = image;
  document.getElementById("result-area").style.display = "block";

  if (!window._xpAdded) {
    window._xpAdded = true;
    if (!playerState.isCompleted("15C")) {
      let currentXP = playerState.getXP();
      currentXP += 5;
      playerState.setXP(currentXP);
      playerState.markCompleted("15C");
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
