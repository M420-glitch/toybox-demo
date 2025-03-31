let draggedTool = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("xp-value").textContent = playerState.getXP();

  document.querySelectorAll(".truth").forEach(tool => {
    tool.addEventListener("dragstart", () => {
      draggedTool = tool;
    });
  });

  document.querySelectorAll(".slot.drop").forEach(drop => {
    drop.addEventListener("dragover", e => e.preventDefault());

    drop.addEventListener("drop", () => {
      if (!draggedTool || drop.children.length > 0) return;
      const expected = drop.parentElement.getAttribute("data-answer");
      const actual = draggedTool.getAttribute("data-label");

      if (expected === actual) {
        drop.textContent = actual;
        drop.classList.add("filled");
        draggedTool.classList.add("used");
        checkCompletion();
      } else {
        drop.style.border = "2px dashed red";
        setTimeout(() => {
          drop.style.border = "2px dashed #2196F3";
        }, 400);
      }
    });
  });

  document.getElementById('btn-register').addEventListener('click', () => {
    window.location.href = '../Toybox-4/WaterMeReveal/index.html';
  });

  document.getElementById('btn-skip').addEventListener('click', () => {
    document.getElementById('force-form').submit();
  });
});

function checkCompletion() {
  const allFilled = Array.from(document.querySelectorAll(".slot.drop"))
    .every(drop => drop.classList.contains("filled"));

  if (allFilled) {
    if (!window._xpAdded) {
      window._xpAdded = true;
      playerState.setXP(playerState.getXP() + 5);
      document.getElementById("xp-value").textContent = playerState.getXP();
    }

    document.getElementById("completion").style.display = "block";
    setTimeout(() => {
      document.getElementById("lightme-modal").style.display = "flex";
    }, 800);
  }
}

function goToMap() {
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}
