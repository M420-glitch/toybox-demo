let dragged = null;
let taskComplete = false;
const correctOrder = ['sun', 'converter', 'light-bulb'];

const config = {
  validPositions: {
    sun: { topMin: 50, topMax: 190, leftMin: 400, leftMax: 540 },
    cloud: { topMin: 50, topMax: 190, leftMin: 100, leftMax: 240 },
    plant: { topMin: 250, topMax: 390, leftMin: 250, leftMax: 390 }
  },

  winCheck: () => {
    const sun = document.getElementById('sun');
    const cloud = document.getElementById('cloud');
    const plant = document.getElementById('plant');
    if (!sun || !cloud || !plant) return false;

    const sunRect = sun.getBoundingClientRect();
    const cloudRect = cloud.getBoundingClientRect();
    const plantRect = plant.getBoundingClientRect();
    const areaRect = document.getElementById('game-area').getBoundingClientRect();

    const sunInBounds = checkInBounds(sunRect, config.validPositions.sun, areaRect);
    const cloudInBounds = checkInBounds(cloudRect, config.validPositions.cloud, areaRect);
    const plantInBounds = checkInBounds(plantRect, config.validPositions.plant, areaRect);

    return sunInBounds && cloudInBounds && plantInBounds;
  }
};

function checkInBounds(rect, bounds, container) {
  const localTop = rect.top - container.top;
  const localLeft = rect.left - container.left;

  return (
    localTop >= bounds.topMin &&
    localTop <= bounds.topMax &&
    localLeft >= bounds.leftMin &&
    localLeft <= bounds.leftMax
  );
}

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

// Handle drop into light-slots
document.querySelectorAll('.light-slot').forEach(slot => {
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

    const allFilled = Array.from(document.querySelectorAll('.light-slot')).every(slot => slot.children.length > 0);
    if (allFilled) checkOrder();

    dragged = null;
  });
});

// Validate slot contents in correct left-to-right order
function checkOrder() {
  const gameAreaEl = document.getElementById('game-area');
  const xpEl = document.getElementById('xp-value');

  const slots = document.querySelectorAll('.light-slot');
  const actualOrder = Array.from(slots).map(slot => {
    const img = slot.querySelector('img');
    return img ? img.id : null;
  });

  const isCorrect = actualOrder.every((id, i) => id === correctOrder[i]);

  if (isCorrect && !taskComplete) {
    taskComplete = true;
    gameAreaEl.classList.add('complete');
    gameAreaEl.style.borderColor = '#28a745';

    if (!playerState.isCompleted("3")) {
      // Award XP
      playerState.addXP("main", 5);

      // Mark the toybox as completed
      playerState.markCompleted("3");

      // Save the player state
      playerState.save();

      xpEl.textContent = playerState.getXP("main");
      xpEl.classList.add('xp-flash');
      setTimeout(() => xpEl.classList.remove('xp-flash'), 500);
    }

    document.getElementById('completion-buttons').style.display = 'block';

    setTimeout(() => {
      alert('✅ You generated light!');
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
  document.querySelectorAll('.light-slot').forEach(slot => {
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
  window.location.href = '../Toybox-4/index.html';
});

document.getElementById('btn-exit').addEventListener('click', () => {
  saveAndExit();
});

window.addEventListener('DOMContentLoaded', () => {
  playerState.load(); // ✅ Now loading from persistent storage
  document.getElementById("xp-value").textContent = playerState.getXP("main");

  const area = document.getElementById('game-area');

  // THIS is creating the extra boxes - REMOVE THIS BLOCK
  const sunBox = document.createElement('div');
  sunBox.className = 'hitbox';
  sunBox.dataset.id = 'sun';
  sunBox.style.border = '2px dashed red';
  sunBox.style.position = 'absolute';
  sunBox.style.left = '400px';
  sunBox.style.top = '50px';
  sunBox.style.width = '140px';
  sunBox.style.height = '140px';
  area.appendChild(sunBox);

  // Same for cloudBox and plantBox - all these are creating extra boxes
  const cloudBox = document.createElement('div');
  // ...

  const plantBox = document.createElement('div');
  // ...

  // Add clickable XP functionality
  const xpValueElement = document.getElementById("xp-value");
  xpValueElement.style.cursor = "pointer";
  xpValueElement.title = "Click to view XP Summary";
  xpValueElement.addEventListener("click", () => {
    window.location.href = "../ProgressMap/xp-summary.html";
  });
});

function goToMap() {
  playerState.save();
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
