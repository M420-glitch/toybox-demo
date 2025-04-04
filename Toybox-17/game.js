const loops = [
  { title: "🎰 Casino Dopamine", text: "Addiction by design. Spikes, lights, and luck illusions = engineered loss. The thrill is the trap. House wins." },
  { title: "🌽 Monocrop Menu", text: "Same seed, same poison. Designed for profit, not nutrition. Addictive food isn’t accidental." },
  { title: "💰 Fake Money", text: "Created from nothing. Loaned with interest. You owe what never existed." },
  { title: "📉 Stock Play", text: "Manipulated wins. Algorithms eat your savings. The board is tilted." },
  { title: "🏛 Rigged Votes", text: "Choose your illusion. Systems rotate power, not reform it. Input ≠ agency." },
  { title: "🎓 Obedience School", text: "Standardised minds. Creativity failed. Conformity passed. You graduated by becoming them." },
  { title: "📺 Content Trap", text: "Fear, gossip, and clickbait. It entertains to distract. Numb the mind. Sell the soul." },
  { title: "🏥 Sick for Profit", text: "Cures aren’t profitable. Symptom management is." },
  { title: "🧠 Caged Mind", text: "Psychedelics, meditation, inquiry = threats. Consciousness outlawed to keep control." },
  { title: "🧵 Cheap Threads", text: "Sweatshops + synthetic waste. Style built on slavery." },
  { title: "📚 Filtered Truth", text: "History was edited. Research was funded. Bias wears a lab coat." },
  { title: "⚡ Energy Prison", text: "Tesla tech. Hemp fuel. Solar. All buried for profit." },
  { title: "🌍 Debt Spiral", text: "Economy designed to crash. Scarcity ensures control. Bailed out only for them." },
  { title: "🌿 Cannabis Clamp", text: "Miracle criminalised. Threatened too many industries. Illegal because it works." },
  { title: "⚖️ Injustice Engine", text: "Legal ≠ Just. Loopholes for them, cages for you." },
  { title: "🧾 Surveillance Spending", text: "Data extracted. Sold. Weaponised. You are the product." },
  { title: "🛒 Buy or Die", text: "Ads don’t sell. They program. Psychology used as warfare." },
  { title: "🧬 Biotech Monopoly", text: "Patents on life. Seeds, genes, medicines owned." },
  { title: "🛰 GeoControl", text: "Borders drawn with war. Maintained with famine. Scarcity = obedience." },
  { title: "👶 Family Factory", text: "Parenthood taxed. Childcare industrialised. Bonding turned subscription." },
  { title: "🌳 Deforestation Deal", text: "Cut forests for cattle feed. You got a burger. They got billions." },
  { title: "🍷 Vice Cycle", text: "Addicted for profit. Blamed for the consequence. Recovery sold separately." },
  { title: "🐌 Inefficiency Industry", text: "Solutions delayed. Because fixing it isn’t profitable." },
  { title: "🗑 Waste Weapon", text: "Waste isn’t failure. It’s strategy. Cluttered minds. Cluttered ecosystems. Cluttered truth." },
  { title: "💀 WASTEGATE", text: "You thought the game was broken. It was venting. You were the pressure valve. Where waste flows, control grows." }
];

let current = 0;

const carousel = document.getElementById('carousel');
const choiceBtns = document.getElementById('choice-buttons');
const xpEl = document.getElementById('xp-value');

window.addEventListener('DOMContentLoaded', () => {
  playerState.load();
  xpEl.textContent = playerState.getXP();
  renderSlide();
});

function renderSlide() {
  const loop = loops[current];
  carousel.innerHTML = `
    <div class="slide-title">${loop.title}</div>
    <div class="slide-text">${loop.text}</div>
  `;
  choiceBtns.style.display = 'flex';
}

function choose() {
  // Award +5 XP per click
  let xp = playerState.getXP();
  xp += 5;
  playerState.setXP(xp);
  xpEl.textContent = xp;

  current++;
  if (current >= loops.length) {
    finishToybox();
  } else {
    renderSlide();
  }
}

function finishToybox() {
  if (!playerState.isCompleted("17")) {
    playerState.markCompleted("17");
  }

  carousel.style.display = 'none';
  choiceBtns.style.display = 'none';
  document.getElementById('completion').style.display = 'block';
}

// Nav
function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
