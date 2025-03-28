window.addEventListener("DOMContentLoaded", () => {
  playerState.load(); // Load from localStorage
  document.getElementById("xp-value").textContent = playerState.getXP();
});

const headings = [
  '🩺 HEALTH',
  '⚡ ENERGY',
  '🧘 CONSCIOUSNESS',
  '🧠 KNOWLEDGE',
  '🥕 FOOD & INDUSTRY',
  '💰 GOVERNANCE'
];

const revealLines = [
  '🩺 HEALTH: These four remind us: wellness is a shared ritual, not a private product.',
  '⚡ ENERGY: They guide us toward self-powered, shared-powered, quietly unstoppable systems.',
  '🧘 CONSCIOUSNESS: Together, they keep us present. Rooted. Awake in a noisy world.',
  '🧠 KNOWLEDGE: They help us gather, question, and pass on what algorithms can’t.',
  '🥕 FOOD & INDUSTRY: They grow loops, not lines. Local hands. Local harvest. Local pride.',
  '💰 GOVERNANCE: They rebuild trust where systems forgot how. Action becomes the vote.'
];

let current = 0;
const circle = document.getElementById('circle');
const circleText = document.getElementById('circle-text');
const revealCol = document.getElementById('reveal-column');
const btn = document.getElementById('inflate-btn');

btn.addEventListener('click', () => {
  if (current < 6) {
    circleText.innerText += headings[current] + '\n';

    const line = document.createElement('p');
    line.textContent = revealLines[current];
    revealCol.appendChild(line);
    setTimeout(() => line.classList.add('revealed'), 10);

    const size = 100 + current * 50;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    current++;

    if (current === 6) {
      btn.textContent = 'Completed';
      btn.disabled = true;

      const xpEl = document.getElementById('xp-value');
      let currentXP = playerState.getXP();
currentXP += 5;
playerState.setXP(currentXP);
xpEl.textContent = currentXP;

      
      xpEl.classList.add('xp-flash');
      setTimeout(() => xpEl.classList.remove('xp-flash'), 400);

      document.getElementById('completion-buttons').style.display = 'block';
    }
  }
});
function goToMap() {
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save(); // Save the current player state
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
