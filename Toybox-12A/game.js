const prompts = [
  "Isn’t it funny how the system gives you choices, but none that change the outcome?",
  "Isn’t it funny how the leaderboard never tracks who changed the rules?",
  "Isn’t it lovely how some players stop playing and start building?"
];

let responses = [null, null, null];

function renderPrompts() {
  const container = document.getElementById("prompt-container");
  prompts.forEach((text, index) => {
    const box = document.createElement("div");
    box.className = "prompt-box";
    box.innerHTML = `
      <div class="prompt-text">${text}</div>
      <div class="choice-buttons">
        <div class="choice-button" onclick="select(${index}, '👍', this)" data-type="agree" data-index="${index}">
          <span>👍</span>
          <div>Agree</div>
        </div>
        <div class="choice-button" onclick="select(${index}, '👎', this)" data-type="disagree" data-index="${index}">
          <span>👎</span>
          <div>Disagree</div>
        </div>
      </div>
    `;
    container.appendChild(box);
  });
}

function select(index, value, element) {
  // Prevent further selection if locked
  if (element.classList.contains("locked")) return;

  responses[index] = value;

  const buttons = element.parentElement.querySelectorAll(".choice-button");
  buttons.forEach(btn => btn.classList.remove("selected", "agree", "disagree"));

  element.classList.add("selected");
  if (element.dataset.type === "agree") {
    element.classList.add("agree");
  } else {
    element.classList.add("disagree");
  }

  checkComplete();
}

function checkComplete() {
  if (responses.every(r => r !== null)) {
    document.getElementById("completion").style.display = "block";
    if (!window._xpAdded) {
      window._xpAdded = true;
      if (!playerState.isCompleted("12A")) {
        let currentXP = playerState.getXP();
        currentXP += 5;
        playerState.setXP(currentXP);
        playerState.markCompleted("12A");
        xpEl.textContent = currentXP;
      
        xpEl.classList.add('xp-flash');
        setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
      }
      
      document.getElementById("xp-value").textContent = playerState.getXP();
      lockAllChoices();
    }
  }
}

function lockAllChoices() {
  const buttons = document.querySelectorAll(".choice-button");
  buttons.forEach(btn => {
    btn.classList.add("locked");
    btn.style.cursor = "default";
    btn.style.opacity = "0.6";
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();
  renderPrompts();
});

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
