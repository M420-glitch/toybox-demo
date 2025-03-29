let dragged = null;
let taskComplete = false;

const config = {
  validPositions: {
    evaporation: { topMin: 200, topMax: 340, leftMin: 100, leftMax: 240 },
    raindrops: { topMin: 200, topMax: 340, leftMin: 360, leftMax: 500 }
  },

  winCheck: () => {
    const evap = document.getElementById('evaporation');
    const rain = document.getElementById('raindrops');
    if (!evap || !rain) return false;

    const evapRect = evap.getBoundingClientRect();
    const rainRect = rain.getBoundingClientRect();
    const areaRect = document.getElementById('game-area').getBoundingClientRect();

    const evapInBounds = checkInBounds(evapRect, config.validPositions.evaporation, areaRect);
    const rainInBounds = checkInBounds(rainRect, config.validPositions.raindrops, areaRect);

    return evapInBounds && rainInBounds;
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

document.getElementById('game-area').addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});

document.getElementById('toolbox').addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});

document.getElementById('game-area').addEventListener('drop', e => {
  e.preventDefault();

  const gameArea = e.currentTarget;
  const rect = gameArea.getBoundingClientRect();
  const x = e.clientX - rect.left - 40;
  const y = e.clientY - rect.top - 40;

  if (dragged) {
    dragged.style.position = 'absolute';
    dragged.style.left = `${x}px`;
    dragged.style.top = `${y}px`;
    dragged.style.zIndex = 20;
    dragged.style.width = '80px';
    dragged.setAttribute('draggable', 'true');
    gameArea.appendChild(dragged);

    if (config.winCheck() && !taskComplete) {
      taskComplete = true;

      const gameAreaEl = document.getElementById('game-area');
      gameAreaEl.classList.add('complete');
      gameAreaEl.style.borderColor = '#28a745';

      const xpEl = document.getElementById('xp-value');
      let currentXP = playerState.getXP();
      currentXP += 5;
      playerState.setXP(currentXP);
      xpEl.textContent = currentXP;
      xpEl.classList.add('xp-flash');
      setTimeout(() => {
        xpEl.classList.remove('xp-flash');
      }, 500);

      document.getElementById('completion-buttons').style.display = 'block';

      setTimeout(() => {
        alert('✅ You completed the water cycle!');
        gameAreaEl.classList.remove('complete');
        gameAreaEl.style.borderColor = '#555';
      }, 1000);
    }

    dragged = null;
  }
});

document.getElementById('btn-continue').addEventListener('click', () => {
  window.location.href = '../Toybox-2/index.html';
});

document.getElementById('btn-exit').addEventListener('click', () => {
  console.log('Exit Toybox');
});

window.addEventListener('DOMContentLoaded', () => {
  playerState.load(); // ✅ Now loading from persistent storage
  document.getElementById("xp-value").textContent = playerState.getXP();

  const area = document.getElementById('game-area');

  const evapBox = document.createElement('div');
  evapBox.style.position = 'absolute';
  evapBox.style.border = '2px dashed blue';
  evapBox.style.left = '100px';
  evapBox.style.top = '200px';
  evapBox.style.width = '140px';
  evapBox.style.height = '140px';
  area.appendChild(evapBox);

  const rainBox = document.createElement('div');
  rainBox.style.position = 'absolute';
  rainBox.style.border = '2px dashed purple';
  rainBox.style.left = '360px';
  rainBox.style.top = '200px';
  rainBox.style.width = '140px';
  rainBox.style.height = '140px';
  area.appendChild(rainBox);

  const upArrow = document.createElement('img');
  upArrow.src = 'assets/water-cycle/arrow-up.png';
  upArrow.alt = 'Up Arrow';
  upArrow.style.position = 'absolute';
  upArrow.style.left = '60px';
  upArrow.style.top = '200px';
  upArrow.style.width = '30px';
  area.appendChild(upArrow);

  const downArrow = document.createElement('img');
  downArrow.src = 'assets/water-cycle/arrow-down.png';
  downArrow.alt = 'Down Arrow';
  downArrow.style.position = 'absolute';
  downArrow.style.left = '510px';
  downArrow.style.top = '340px';
  downArrow.style.width = '30px';
  area.appendChild(downArrow);
});

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
