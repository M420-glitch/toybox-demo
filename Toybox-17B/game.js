let draggedTool = null;
const dropBoxes = document.querySelectorAll(".drop-box");
const tools = document.querySelectorAll(".tool");

tools.forEach(tool => {
  tool.addEventListener("dragstart", () => {
    draggedTool = tool;
  });
});

dropBoxes.forEach(box => {
  box.addEventListener("dragover", e => {
    e.preventDefault();
  });

  box.addEventListener("drop", () => {
    if (!draggedTool) return;
    const correct = box.getAttribute("data-answer");
    const attempt = draggedTool.getAttribute("data-label");

    if (correct === attempt && box.children.length === 0) {
      box.appendChild(draggedTool);
      draggedTool.setAttribute("draggable", false);
      checkComplete();
    } else {
      box.style.border = "2px dashed red";
      setTimeout(() => {
        box.style.border = "2px dashed #4caf50";
      }, 400);
    }
  });
});

function checkComplete() {
  let allCorrect = true;
  dropBoxes.forEach(box => {
    const expected = box.getAttribute("data-answer");
    const actual = box.children[0]?.getAttribute("data-label");
    if (expected !== actual) {
      allCorrect = false;
    }
  });

  if (allCorrect) {
    document.getElementById("completion").style.display = "block";
    if (!window._xpAdded) {
      window._xpAdded = true;
      playerState.setXP(playerState.getXP() + 5);
      document.getElementById("xp-value").textContent = playerState.getXP();
    }
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
