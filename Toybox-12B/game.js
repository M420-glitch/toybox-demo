let matched = 0;
const total = 6;

window.addEventListener("DOMContentLoaded", () => {
  playerState.load();
  document.getElementById("xp-value").textContent = playerState.getXP();

  const draggables = document.querySelectorAll(".draggable");
  const dropzones = document.querySelectorAll(".dropzone");

  draggables.forEach(el => {
    el.setAttribute("draggable", "true");

    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", el.dataset.match);
      e.dataTransfer.setData("text/id", el.textContent);
    });
  });

  dropzones.forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());

    zone.addEventListener("drop", e => {
      e.preventDefault();
      const draggedMatch = e.dataTransfer.getData("text/plain");
      const draggedId = e.dataTransfer.getData("text/id");
      const accept = zone.dataset.accept;

      if (draggedMatch === accept && zone.childNodes.length <= 1) {
        const item = document.querySelector(`.draggable:contains('${draggedId}')`);
        zone.appendChild(document.querySelector(`.draggable[data-match='${draggedMatch}']`));
        matched++;
        checkComplete();
      }
    });
  });
});

function checkComplete() {
  if (matched === total) {
    document.getElementById("completion").style.display = "block";
    if (!window._xpAdded) {
      window._xpAdded = true;
      let xp = playerState.getXP() + 10;
      playerState.setXP(xp);
      document.getElementById("xp-value").textContent = xp;
    }
  }
}

function continueToNext() {
  window.location.href = "../Toybox-13/index.html";
}

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
'''

with open("/mnt/data/Toybox-12B/game.js", "w") as f:
    f.write(js_content)