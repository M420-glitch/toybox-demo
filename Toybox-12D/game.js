const prompts = [
  "Isn’t it funny how questioning the rules gets you punished faster than breaking them?",
  "Isn’t it funny how obedience is safe, but truth is dangerous?",
  "Isn’t it lovely how one quiet refusal can shake a whole system?"
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
        <div class="choice-button" onclick="select(${index}, '👍', this)" data-type="agree">
          <span>👍</span>
          <div>Agree</div>
        </div>
        <div class="choice-button" onclick="select(${index}, '👎', this)" data-type="disagree">
          <span>👎</span>
          <div>Disagree</div>
        </div>
      </div>
    `;
    container.appendChild(box);
  });
}

function select(index, value, element) {
  if (responses[index] !== null) return;

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
      if (!playerState.isCompleted("12D")) {
        let currentXP = playerState.getXP();
        currentXP += 5;
        playerState.setXP(currentXP);
        playerState.markCompleted("12D");
        xpEl.textContent = currentXP;
      
        xpEl.classList.add('xp-flash');
        setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
      }
      
      document.getElementById("xp-value").textContent = playerState.getXP();
    }
  }
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
