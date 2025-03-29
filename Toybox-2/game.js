window.addEventListener("DOMContentLoaded", () => {
  playerState.load(); // Load from localStorage
  document.getElementById("xp-value").textContent = playerState.getXP();
});

let dragged = null;
let taskComplete = false;
const correctItems = ['seed', 'water-can', 'sun'];
let placedItems = [];

document.querySelectorAll('.draggable').forEach(el => {
  el.addEventListener('dragstart', e => {
    dragged = e.target;
    setTimeout(() => {
      e.target.style.visibility = 'hidden';
    }, 0);
  });
// Allow dragover anywhere inside game area
document.getElementById('game-area').addEventListener('dragover', e => {
  e.preventDefault();
});

  el.addEventListener('dragend', e => {
    e.target.style.visibility = 'visible';
  });
});

document.querySelectorAll('.grow-slot').forEach(slot => {
  slot.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  slot.addEventListener('drop', e => {
    e.preventDefault();

    if (!dragged) return;
    if (slot.children.length > 0) return;

    dragged.style.position = 'relative';
    dragged.style.left = '0px';
    dragged.style.top = '0px';
    dragged.style.width = '80px';
    dragged.style.zIndex = 1;
    dragged.style.margin = 'auto';
    dragged.setAttribute('draggable', 'false');

    slot.appendChild(dragged);
    placedItems.push(dragged.id);

    if (placedItems.length === 3) checkGrowResult();
    dragged = null;
  });
});

function checkGrowResult() {
  const gameAreaEl = document.getElementById('game-area');
  const xpEl = document.getElementById('xp-value');

  const isValid = correctItems.every(item => placedItems.includes(item));

  if (isValid) {
    gameAreaEl.classList.add('complete');
    gameAreaEl.style.borderColor = '#28a745';

    let currentXP = playerState.getXP();
currentXP += 5;
playerState.setXP(currentXP);
xpEl.textContent = currentXP;

    xpEl.classList.add('xp-flash');
    setTimeout(() => xpEl.classList.remove('xp-flash'), 500);

    document.getElementById('completion-buttons').style.display = 'block';

    setTimeout(() => {
      alert('✅ Crops successfully planted!');
      gameAreaEl.classList.remove('complete');
      gameAreaEl.style.borderColor = '#555';
    }, 1000);
  } else {
    gameAreaEl.style.borderColor = '#b00020';

setTimeout(() => {
  alert('❌ Something’s not right in the soil... Try again.');
  gameAreaEl.style.borderColor = '#555';

  // Reset logic
  placedItems = [];
  document.querySelectorAll('.grow-slot').forEach(slot => {
    const item = slot.querySelector('img');
    if (item) {
      document.getElementById('toolbox').appendChild(item);
      item.setAttribute('draggable', 'true');
      item.style.position = 'static';
      item.style.margin = '10px';
    }
  });
}, 1000);

  }
}

document.getElementById('btn-continue').addEventListener('click', () => {
  window.location.href = '../Toybox-3/index.html'; 
});

document.getElementById('btn-exit').addEventListener('click', () => {
  console.log('Exit Toybox');
});
function goToMap() {
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save(); // Save the current player state
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
