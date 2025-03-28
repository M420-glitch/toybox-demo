window.addEventListener("DOMContentLoaded", () => {
  playerState.load(); // Load from localStorage
  document.getElementById("xp-value").textContent = playerState.getXP();
});

const questions = [
  // HEALTH
  ['🧘 Train daily → 🏃 Take shortcuts → 💉 Inject results', '🧘', '🏃', '💉'],
  ['🥗 Whole foods diet → 🍱 Meal kits → 🍔 Fast food', '🥗', '🍱', '🍔'],
  ['💤 Sleep early → 🕯️ Meditation app → 🧠 Nootropics', '💤', '🕯️', '🧠'],

  // KNOWLEDGE
  ['📚 Read a book → 🎧 Listen to summary → 💬 Read a meme', '📚', '🎧', '💬'],
  ['📝 Write a novel → 📽️ Make a film → 🎞️ Watch a TikTok', '📝', '📽️', '🎞️'],

  // CONSCIOUSNESS
  ['🧘 Meditate → 🌿 Plant medicine → 💊 Clarity pill', '🧘', '🌿', '💊'],

  // FOOD
  ['👩‍🌾 Grow food → 🛒 Shop organic → 🍽️ Order in', '👩‍🌾', '🛒', '🍽️'],

  // ENERGY
  ['🌞 Solar setup → 🔋 Battery system → 🔌 Plug into grid', '🌞', '🔋', '🔌'],

  // ECONOMY
  ['🧱 Build business → 🛠️ Gig work → 📈 Buy stock', '🧱', '🛠️', '📈']
];

let current = 0;
let score = { A: 0, B: 0, C: 0 };

// Randomize and reduce to 9 questions
const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 9);

const questionText = document.getElementById('question-text');
const questionCount = document.getElementById('question-count');
const answerButtons = document.querySelectorAll('.answer');
const resultBox = document.getElementById('result-box');
const quizBox = document.getElementById('quiz-box');
const resultText = document.getElementById('result-text');
const resultTitle = document.getElementById('result-title');

function showQuestion(index) {
  const q = shuffled[index];
  questionCount.textContent = `Question ${index + 1} of 9`;
  questionText.textContent = q[0];
  answerButtons[0].textContent = q[1];
  answerButtons[1].textContent = q[2];
  answerButtons[2].textContent = q[3];
}

answerButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const choice = ['A', 'B', 'C'][i];
    score[choice]++;
    current++;
    if (current < 9) {
      showQuestion(current);
    } else {
      showResult();
    }
  });
});

function showResult() {
  quizBox.style.display = 'none';
  resultBox.style.display = 'block';

  const max = Math.max(score.A, score.B, score.C);
  const counts = Object.values(score);
  const isSplit = counts.filter(n => n === max).length > 1;

 let text = '';
if (isSplit) {
  text = '⚖️ You’ve walked the long road, followed the map, and leapt into fire.\nYou hold roots, rhythm, and raw momentum.\nYou are not one path—you are the convergence.';
} else if (score.A === max) {
  text = '🛡️ You move slow by choice.\nYou build. You plant. You carry the weight others won’t.\nYou are roots. Memory. The one who reminds the world what it’s forgotten.';
} else if (score.B === max) {
  text = '🧭 You read the land before stepping.\nYou don’t rush, and you don’t run.\nYou lead not by force, but by knowing exactly when to move.';
} else {
  text = '⚡ You are already halfway there.\nWhere others wait for proof, you leap.\nYou are instinct sharpened. Change embodied. The strike before the sound.';
}


  resultText.textContent = text;
  resultText.textContent = text;

  // ✅ Add XP +5 logic
  const xpEl = document.getElementById('xp-value');
  let currentXP = playerState.getXP();
  currentXP += 5;
  playerState.setXP(currentXP);
  xpEl.textContent = currentXP;
  xpEl.classList.add('xp-flash');
  setTimeout(() => xpEl.classList.remove('xp-flash'), 400);
  
  // ✅ Show the Continue button
  document.getElementById('completion-buttons').style.display = 'block';
  
}

document.getElementById('restart').addEventListener('click', () => {
  location.reload();
});

showQuestion(current);
function goToMap() {
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save(); // Save the current player state
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
