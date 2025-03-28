window.addEventListener("DOMContentLoaded", () => {
  playerState.load(); // Load from localStorage
  document.getElementById("xp-value").textContent = playerState.getXP();
});

const lines = {
  gamers: [
    "Gamers Guild: Play isn’t wasted time. It’s how we learn, build, and bond.",
    "Gamers Guild: Not every game happens on-screen. Some rewrite the real world.",
    "Gamers Guild: Strategy, story, skill—your hours weren’t for nothing."
  ],
  bud: [
    "Bud Brigade: Nature isn’t a theme. It’s a tech stack older than language.",
    "Bud Brigade: You don’t have to escape the system. You can root through it.",
    "Bud Brigade: Healing. Soil. Breath. It’s not just aesthetic. It’s everything."
  ],
  crypto: [
    "Crypto Crew: Web3 is optional. But optional doesn’t mean irrelevant.",
    "Crypto Crew: You don’t need a wallet to earn trust. Just action.",
    "Crypto Crew: When used right, tech decentralizes power—not multiplies it."
  ],
  defiant: [
    "Defiant Disruptors: You don’t have to fight the system. Just outgrow it.",
    "Defiant Disruptors: Governance isn’t about power. It’s about proof.",
    "Defiant Disruptors: The rules can’t stop those who write new ones."
  ]
};

let revealed = {
  gamers: false,
  bud: false,
  crypto: false,
  defiant: false
};

function reveal(id, target) {
  if (revealed[id]) return;
  const pool = lines[id];
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  target.textContent = chosen;
  target.classList.add("revealed");
  revealed[id] = true;

  if (Object.values(revealed).every(val => val)) {
    document.getElementById("completion-buttons").style.display = "block";

    if (!window._xpAdded) {
      window._xpAdded = true;
      const xpEl = document.getElementById("xp-value");
      let currentXP = playerState.getXP();
currentXP += 5;
playerState.setXP(currentXP);
xpEl.textContent = currentXP;

      xpEl.classList.add("xp-flash");
      setTimeout(() => xpEl.classList.remove("xp-flash"), 400);
    }
  }
}

document.getElementById("gamers").addEventListener("click", () => {
  reveal("gamers", document.getElementById("gamers-text"));
});
document.getElementById("bud").addEventListener("click", () => {
  reveal("bud", document.getElementById("bud-text"));
});
document.getElementById("crypto").addEventListener("click", () => {
  reveal("crypto", document.getElementById("crypto-text"));
});
document.getElementById("defiant").addEventListener("click", () => {
  reveal("defiant", document.getElementById("defiant-text"));
});

document.getElementById("btn-continue").addEventListener("click", () => {
  document.getElementById("groundme-modal").style.display = "flex";
});

document.getElementById("btn-register").addEventListener("click", () => {
  document.getElementById("groundme-modal").style.display = "none";
  window.location.href = "./GroundMeReveal/index.html"; // ✅ ADD THIS LINE
});


document.getElementById("btn-skip").addEventListener("click", () => {
  document.getElementById("groundme-modal").style.display = "none";
  window.location.href = "../Toybox-10/index.html";
});
function goToMap() {
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save(); // Save the current player state
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
