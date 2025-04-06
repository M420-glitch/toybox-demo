window.addEventListener("DOMContentLoaded", () => {
  playerState.load(); // Load from localStorage
  document.getElementById("xp-value").textContent = playerState.getXP("main");
  
  // Make XP clickable and link to XP summary
  const xpValueElement = document.getElementById("xp-value");
  xpValueElement.style.cursor = "pointer";
  xpValueElement.title = "Click to view XP Summary";
  xpValueElement.addEventListener("click", () => {
    window.location.href = "../ProgressMap/xp-summary.html";
  });
});

let dragged = null;
let taskComplete = false;
const correctItems = ['seeds', 'fire', 'whispers', 'straw'];

// Init drag logic
document.querySelectorAll('.draggable').forEach(el => {
  el.addEventListener('dragstart', e => {
    dragged = e.target;
    setTimeout(() => {
      e.target.style.visibility = 'hidden';
    }, 0);
  });

  el.addEventListener('dragend', e => {
    e.target.style.visibility = 'visible';
  });
});

// Allow dragover anywhere in game area
document.getElementById('game-area').addEventListener('dragover', e => {
  e.preventDefault();
});

// Extra safety for hover detection
document.querySelectorAll('.blow-slot').forEach(slot => {
  slot.addEventListener('dragenter', e => {
    e.preventDefault();
  });
});

// Handle drop into blow-slots
document.querySelectorAll('.blow-slot').forEach(slot => {
  slot.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  slot.addEventListener('drop', e => {
    e.preventDefault();
    if (!dragged || slot.children.length > 0) return;

    dragged.style.position = 'relative';
    dragged.style.left = '0px';
    dragged.style.top = '0px';
    dragged.style.width = '80px';
    dragged.style.zIndex = 1;
    dragged.style.margin = 'auto';
    dragged.setAttribute('draggable', 'false');

    slot.appendChild(dragged);

    const allFilled = Array.from(document.querySelectorAll('.blow-slot')).every(slot => slot.children.length > 0);
    if (allFilled) checkWindItems();

    dragged = null;
  });
});

// Validate item contents regardless of order
function checkWindItems() {
  const gameAreaEl = document.getElementById('game-area');
  const xpEl = document.getElementById('xp-value');

  const slots = document.querySelectorAll('.blow-slot');
  const chosen = Array.from(slots).map(slot => {
    const img = slot.querySelector('img');
    return img ? img.id : null;
  });

  const isCorrect =
    chosen.length === 4 &&
    correctItems.every(item => chosen.includes(item));

  if (isCorrect && !taskComplete) {
    taskComplete = true;
    gameAreaEl.classList.add('complete');
    gameAreaEl.style.borderColor = '#28a745';

    if (!playerState.isCompleted("4")) {
      // Award XP
      playerState.addXP("main", 5);
      
      // Award the Water Me Me token here, when toybox is completed
      playerState.markMeMeEarned("water");
      
      // Mark the toybox as completed
      playerState.markCompleted("4");

      // Save the player state
      playerState.save();

      xpEl.textContent = playerState.getXP("main");
      xpEl.classList.add('xp-flash');
      setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
    }

    setTimeout(() => {
      document.getElementById('waterme-modal').style.display = 'flex';
      gameAreaEl.classList.remove('complete');
      gameAreaEl.style.borderColor = '#555';
    }, 1000);
  } else {
    gameAreaEl.style.borderColor = '#b00020';

    setTimeout(() => {
      alert('❌ Something’s too heavy. Try again.');
      gameAreaEl.style.borderColor = '#555';
      resetSlots();
    }, 1000);
  }
}

// Reset all slots for retry
function resetSlots() {
  document.querySelectorAll('.blow-slot').forEach(slot => {
    const item = slot.querySelector('img');
    if (item) {
      document.getElementById('toolbox').appendChild(item);
      item.setAttribute('draggable', 'true');
      item.style.position = 'static';
      item.style.margin = '10px 0';
    }
  });
}

// Register button logic (optional)
document.getElementById('btn-register').addEventListener('click', () => {
  console.log('Redirect to registration');
  document.getElementById('waterme-modal').style.display = 'none';
  playerState.save();
  window.location.href = '../Toybox-4/WaterMeReveal/index.html';
});

document.getElementById('btn-continue').addEventListener('click', () => {
  window.location.href = '../Toybox-5/index.html';
});

document.getElementById('btn-exit').addEventListener('click', () => {
  saveAndExit();
});

function goToMap() {
  playerState.save();
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save(); // Save the current player state
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
