window.addEventListener("DOMContentLoaded", () => {
  playerState.load();
  const currentXP = playerState.getXP("main");
  document.getElementById("xp-display").textContent = `Current XP: ${currentXP}`;

  document.querySelectorAll("button[data-xp]").forEach(btn => {
    const requiredXP = parseInt(btn.getAttribute("data-xp"));
    const toyboxId = btn.textContent;
    const toyboxNumber = parseInt(toyboxId);

    let isAccessible = true;

    // Sequential unlocking for Toyboxes 5 onwards
    if (toyboxNumber >= 5) {
      const previousToyboxId = (toyboxNumber - 1).toString();
      if (!playerState.isCompleted(previousToyboxId)) {
        isAccessible = false;
      }
    }

    if (playerState.isCompleted(toyboxId)) {
      btn.classList.add("completed");
    } else if (toyboxNumber < 5 && playerState.getXP("main") >= requiredXP) {
      btn.classList.add("unlocked");
    } else if (toyboxNumber >= 5 && isAccessible) {
      btn.classList.add("unlocked");
    } else {
      btn.disabled = true;
      btn.classList.add("locked");
    }
  });

  // Add these lines after handling the toybox buttons
  // Update all Me Me token statuses
  updateMeMeStatus("water", "4", "water-me-me-connection");
  updateMeMeStatus("ground", "9", "ground-me-me-connection");
  updateMeMeStatus("light", "14", "light-me-me-connection");
  updateMeMeStatus("blow", "18", "blow-me-me-connection");

  // Debug info
  console.log("Water token value:", playerState.meMeTokens.water);
  console.log("Water token percentage:", playerState.getMeMePercentage("water"));
});

function goTo(folderName) {
  window.location.href = `../${folderName}/index.html`;
}

function goToPledge(folderName) {
  window.location.href = `../${folderName}/index.html`;
}

function resetProgress() {
  playerState.clearData();
  window.location.reload();
}

// Update the updateMeMeStatus function in your Progress Map JS

const updateMeMeStatus = (meMeId, toyboxNumber, elementId) => {
  const statusElementId = `${meMeId}-me-me-status`;
  const statusElement = document.getElementById(statusElementId);
  const meMeConnection = document.getElementById(elementId);

  // Check if Me Me is earned first
  if (playerState.meMeTokens[meMeId] > 0) {
    const percentage = playerState.getMeMePercentage(meMeId);
    
    // Remove any previous status classes
    meMeConnection.classList.remove('locked', 'healthy', 'fading', 'weak');
    
    if (percentage >= 80) {
      statusElement.textContent = "Healthy!";
      meMeConnection.classList.add('healthy');
    } else if (percentage >= 50) {
      statusElement.textContent = "Fading...";
      meMeConnection.classList.add('fading');
    } else {
      statusElement.textContent = "Needs care!";
      meMeConnection.classList.add('weak');
    }
  } else if (playerState.isCompleted(toyboxNumber)) {
    statusElement.textContent = "Earned!";
    meMeConnection.classList.remove('locked');
  } else {
    statusElement.textContent = "Unlock Here";
    meMeConnection.classList.add('locked');
  }
};

// Add this to map.js to restore the status text visibility
document.addEventListener("DOMContentLoaded", () => {
  // Restore status text visibility
  document.querySelectorAll(".connection-text").forEach(statusText => {
    statusText.style.display = "block";
    statusText.style.position = "relative";
    statusText.style.marginLeft = "10px";
  });
  
  // Continue with your existing code...
});
