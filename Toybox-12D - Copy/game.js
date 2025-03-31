let matched = {};

Sortable.create(document.getElementById("fragments"), {
  group: {
    name: "labels",
    pull: true,
    put: true
  },
  animation: 150
});

document.querySelectorAll(".dropzone").forEach(zone => {
  Sortable.create(zone, {
    group: {
      name: "labels",
      pull: false,
      put: true
    },
    animation: 150,
    onAdd: function (evt) {
      const dragged = evt.item;
      const target = zone.dataset.target;
      const label = dragged.dataset.label;

      // If correct match and not already matched
      if (target === label && !matched[target]) {
        matched[target] = dragged;
        zone.classList.add("matched");

        // Lock fragment in place
        dragged.setAttribute("draggable", false);
        dragged.style.cursor = "default";
        dragged.style.opacity = "0.8";

        checkComplete();
      } else {
        // Incorrect or already matched — return to fragments
        document.getElementById("fragments").appendChild(dragged);
      }
    }
  });
});

function checkComplete() {
  // Ensure all matched fragments are still inside their correct dropzones
  let validMatches = 0;

  Object.entries(matched).forEach(([target, element]) => {
    const parentZone = element.parentElement;
    if (parentZone && parentZone.classList.contains("dropzone") && parentZone.dataset.target === target) {
      validMatches++;
    }
  });

  if (validMatches === 6) {
    document.getElementById("completion").style.display = "block";
    if (!window._xpAdded) {
      window._xpAdded = true;
      playerState.setXP(playerState.getXP() + 10);
      document.getElementById("xp-value").textContent = playerState.getXP();
    }
  } else {
    document.getElementById("completion").style.display = "none";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();
});

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
