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

  if (chosenSeed === "Annual Bloom" && chosenEnv === "Rich Humus") {
    message = "🌼 Quick color, fleeting life. Pretty, but gone by winter.";
    image = "assets/images/annual.png";
  } else if (chosenSeed === "Perennial Root" && chosenEnv === "Underground Vault") {
    message = "🌲 Hidden strength. What you planted will outlast you.";
    image = "assets/images/perennial.png";
  } else if (chosenSeed === "Flash Fungus" || chosenEnv === "Toxic Runoff") {
    message = "🍄 It fed on poison and grew fast. But it poisoned the soil.";
    image = "assets/images/fungus-toxic.png";
  } else {
    message = "🌿 Something green emerged… but it’s struggling.";
    image = "assets/images/neutral-grow.png";
  }

  result.textContent = message;
  img.src = image;
  document.getElementById("result-area").style.display = "block";

  if (!window._xpAdded) {
    window._xpAdded = true;
    if (!playerState.isCompleted("15B")) {
      let currentXP = playerState.getXP();
      currentXP += 5;
      playerState.setXP(currentXP);
      playerState.markCompleted("15B");
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
