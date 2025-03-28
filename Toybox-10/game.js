window.addEventListener("DOMContentLoaded", () => {
  playerState.load(); // Load from localStorage
  document.getElementById("xp-value").textContent = playerState.getXP();
});

let matched = {
  gamers: false,
  bud: false,
  crypto: false,
  defiant: false
};

let dragged = null;

document.querySelectorAll('.mission').forEach(el => {
  el.addEventListener('dragstart', e => {
    dragged = e.target;
  });
});

document.querySelectorAll('.drop-zone').forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.style.backgroundColor = '#e0ffff';
  });

  zone.addEventListener('dragleave', () => {
    zone.style.backgroundColor = '';
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.style.backgroundColor = '';
    if (!dragged) return;

    const missionType = dragged.dataset.mission;
    const zoneMatch = zone.dataset.match;

    if (missionType === zoneMatch && zone.children.length === 0) {
      zone.appendChild(dragged);
      zone.classList.add('filled');
      matched[zoneMatch] = true;
      checkAllMatched();
    }
  });
});

function checkAllMatched() {
  if (Object.values(matched).every(val => val)) {
    document.getElementById('fork-choice').style.display = 'block';

    // ✅ XP logic: +5 XP, once
    if (!window._xpAdded) {
      window._xpAdded = true;
      const xpEl = document.getElementById('xp-value');
      let currentXP = playerState.getXP();
currentXP += 5;
playerState.setXP(currentXP);
xpEl.textContent = currentXP;

      xpEl.classList.add('xp-flash');
      setTimeout(() => xpEl.classList.remove('xp-flash'), 400);
    }
  }
}

document.querySelectorAll('#fork-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;

    // ✅ Redirect to Toybox-10X based on choice
    if (choice === 'GG') window.location.href = '../Toybox-11A/index.html';
    if (choice === 'BB') window.location.href = '../Toybox-11B/index.html';
    if (choice === 'CC') window.location.href = '../Toybox-11C/index.html';
    if (choice === 'DD') window.location.href = '../Toybox-11D/index.html';
  });
});
function goToMap() {
  window.location.href = "../ProgressMap/index.html"; // Adjust path if needed
}

function saveAndExit() {
  playerState.save(); // Save the current player state
  window.location.href = "../ExitScreen/index.html"; // Adjust path if needed
}
