const slides = [
  {
    type: "text",
    content: "“There is nothing left to complete. Only something to begin.”",
    button: "click to continue"
  },
  {
    type: "text",
    content: "“A silent seed, in starlight sown,<br/>Where shadows dance, and echoes moan…”",
    button: "❍ CONTINUE"
  },
  {
    type: "choice",
    content: "You are no longer a player.<br/>You are now a postman.<br/><br/>Your story will write itself —<br/>or be written by someone else.",
    choices: [
      { text: "✉️ I release control. I become the wind.", value: "accept" },
      { text: "🔒 I don’t understand.", value: "reject" }
    ]
  },
  {
    type: "text",
    content: "Crack the postman…<br/>…and you crack the world.<br/><br/>Whispers begin tomorrow.",
    button: "☰ JOIN THE WHISPERS"
  }
];

let current = 0;
const container = document.getElementById('slide-container');
const xpEl = document.getElementById('xp-value');

window.addEventListener('DOMContentLoaded', () => {
  playerState.load();
  xpEl.textContent = playerState.getXP();
  renderSlide();
});

function renderSlide() {
  const slide = slides[current];
  container.innerHTML = '';

  const textEl = document.createElement('div');
  textEl.className = 'slide-text';
  textEl.innerHTML = slide.content;
  container.appendChild(textEl);

  if (slide.type === "text") {
    const btn = document.createElement('button');
    btn.className = 'slide-button';
    btn.textContent = slide.button;
    btn.onclick = nextSlide;
    container.appendChild(btn);
  }

  if (slide.type === "choice") {
    slide.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'slide-button alt';
      btn.textContent = choice.text;
      btn.onclick = () => handleChoice(choice.value);
      container.appendChild(btn);
    });
  }
}

function nextSlide() {
  current++;
  if (current < slides.length) {
    renderSlide();
  } else {
    completeToybox();
  }
}

function handleChoice(value) {
  if (value === "accept") {
    playerState.setFlag("blowMeMeAccepted", true);
    nextSlide();
  } else if (value === "reject") {
    window.location.href = "../Toybox-1/index.html";
  }
}

function completeToybox() {
  if (!playerState.isCompleted("18")) {
    let xp = playerState.getXP();
    playerState.setXP(xp + 5);
    playerState.markCompleted("18");
    xpEl.textContent = xp + 5;
  }

  window.location.href = "../ProgressMap/index.html";
}
