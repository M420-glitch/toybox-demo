window.addEventListener("DOMContentLoaded", () => {
  playerState.load(); // Load from localStorage
  document.getElementById("xp-value").textContent = playerState.getXP();
});

const questions = [
  {
    text: '🩺 HEALTH — If you could care for your body your way, what would you choose?',
    A: '🍃 Walk barefoot, grow food, rest deeply',
    B: '🧘 Gym, apps, supplements—trying to keep up',
    C: '💊 Caffeine, chaos, and crash recovery'
  },
  {
    text: '🧘 CONSCIOUSNESS — How would you find clarity if time and space weren’t a limit?',
    A: '🔮 Sit in stillness, commune with nature, dream awake',
    B: '🎧 Meditation apps, quotes, mindfulness dabbling',
    C: '🐒 Doomscrolling while yelling at a podcast'
  },
  {
    text: '🧠 KNOWLEDGE — How would you seek truth if nothing held you back?',
    A: '📚 Study from source, challenge norms, ask deeply',
    B: '🗞️ Skim trends, follow experts, stay current',
    C: '📡 Absorb whatever shows up between ads'
  },
  {
    text: '🥕 FOOD & INDUSTRY — Where would your food come from if you had the choice?',
    A: '🌾 Grown in soil, harvested by hand, local loops',
    B: '🥫 Natural-looking brands from megastores',
    C: '🧪 Sludge wrapped in six layers of greenwashing'
  },
  {
    text: '⚡ ENERGY — How would you power your life?',
    A: '☀️ Sun + surplus, shared through microgrids',
    B: '⚡ Pay what the market asks, plug and go',
    C: '🔥 Burn oil, curse the bill, blame the wind'
  },
  {
    text: '💰 ECONOMY — Who decides your future in your ideal world?',
    A: '🧱 Communities voting with action and value',
    B: '🏛️ Career politicians and old-world systems',
    C: '🐍 Bots, billionaires, and ballot machines'
  }
];

let current = 0;
let score = { A: 0, B: 0, C: 0 };

const questionText = document.getElementById('question-text');
const questionCount = document.getElementById('question-count');
const answerButtons = document.querySelectorAll('.answer');
const resultBox = document.getElementById('result-box');
const quizBox = document.getElementById('quiz-box');
const resultText = document.getElementById('result-text');
const resultTitle = document.getElementById('result-title');

function showQuestion(index) {
  const q = questions[index];
  questionCount.textContent = `Question ${index + 1} of ${questions.length}`;
  questionText.textContent = q.text;
  answerButtons[0].textContent = q.A;
  answerButtons[1].textContent = q.B;
  answerButtons[2].textContent = q.C;
}

answerButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const choice = ['A', 'B', 'C'][i];
    score[choice]++;
    current++;
    if (current < questions.length) {
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
    text = '⚖️ You’ve leaned into roots, systems, and speed. You are flexible, fluid, and still forming.';
  } else if (score.A === max) {
    text = '🛡️ You’d choose to build. Steady. Intentional. Rooted in the real. The long road is your way.';
  } else if (score.B === max) {
    text = '🧭 You’d optimize. Balance structure with flow. Work with the tools and tune the machine.';
  } else {
    text = '⚡ You’d skip to the end. Hack the system. Break the loop. Fast paths. High risk. Sharp instinct.';
  }

  resultText.textContent = text;

  // ✅ Prevent double XP add
  if (!window._xpAdded) {
    window._xpAdded = true;

    const xpEl = document.getElementById('xp-value');
    let currentXP = playerState.getXP();
currentXP += 5;
if (!playerState.isCompleted("7")) {
  let currentXP = playerState.getXP();
  currentXP += 5;
  playerState.setXP(currentXP);
  playerState.markCompleted("7");
  xpEl.textContent = currentXP;

  xpEl.classList.add('xp-flash');
  setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
}

    document.getElementById('completion-buttons').style.display = 'block';
  }
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
