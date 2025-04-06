window.addEventListener("DOMContentLoaded", () => {
  playerState.load(); // Load from localStorage
  document.getElementById("xp-value").textContent = playerState.getXP("water");
});

let dragged = null;
let taskComplete = false;
const correctOrder = ['plugin-chip', 'ether-cable', 'gaia-disc'];

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

// Handle drop into plugin-slots
document.querySelectorAll('.plugin-slot').forEach(slot => {
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

    const allFilled = Array.from(document.querySelectorAll('.plugin-slot')).every(slot => slot.children.length > 0);
    if (allFilled) checkOrder();

    dragged = null;
  });
});

// Validate slot contents in correct left-to-right order
function checkOrder() {
  const gameAreaEl = document.getElementById('game-area');
  const xpEl = document.getElementById('xp-value');

  const slots = document.querySelectorAll('.plugin-slot');
  const actualOrder = Array.from(slots).map(slot => {
    const img = slot.querySelector('img');
    return img ? img.id : null;
  });

  const isCorrect = actualOrder.every((id, i) => id === correctOrder[i]);

  if (isCorrect && !taskComplete) {
    taskComplete = true;
    gameAreaEl.classList.add('complete');
    gameAreaEl.style.borderColor = '#28a745';

    if (!playerState.isCompleted("install-plugin")) {
      // Award XP
      playerState.addXP("water", 5);

      // Mark the toybox as completed
      playerState.markCompleted("install-plugin");

      // Save the player state
      playerState.save();

      xpEl.textContent = playerState.getXP("water");
      xpEl.classList.add('xp-flash');
      setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
    }

    document.getElementById('completion-buttons').style.display = 'block';

    setTimeout(() => {
      alert('✅ You installed the plugin!');
      gameAreaEl.classList.remove('complete');
      gameAreaEl.style.borderColor = '#555';
    }, 1000);
  } else {
    gameAreaEl.style.borderColor = '#b00020';

    setTimeout(() => {
      alert('❌ Incorrect sequence. Try again.');
      gameAreaEl.style.borderColor = '#555';
      resetSlots();
    }, 1000);
  }
}

// Reset all slots for retry
function resetSlots() {
  document.querySelectorAll('.plugin-slot').forEach(slot => {
    const item = slot.querySelector('img');
    if (item) {
      document.getElementById('toolbox').appendChild(item);
      item.setAttribute('draggable', 'true');
      item.style.position = 'static';
      item.style.margin = '10px 0';
    }
  });
}

// Buttons
document.getElementById('btn-continue').addEventListener('click', () => {
  window.location.href = '../../../Toybox-4/WaterMeReveal/index.html';
});

document.getElementById('btn-exit').addEventListener('click', () => {
  console.log('Exit Toybox');
});

function goToMap() {
  window.location.href = "../../../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save(); // Save the current player state
  window.location.href = "../../../ExitScreen/index.html"; // Adjust path if needed
}
