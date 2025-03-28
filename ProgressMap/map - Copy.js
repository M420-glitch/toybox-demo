window.addEventListener("DOMContentLoaded", () => {
  playerState.load();
  const currentXP = playerState.getXP();
  document.getElementById("xp-display").textContent = `Current XP: ${currentXP}`;

  // Disable buttons the player hasn't unlocked yet
  document.querySelectorAll("button[data-xp]").forEach(btn => {
    const requiredXP = parseInt(btn.getAttribute("data-xp"));
    if (currentXP < requiredXP) {
      btn.disabled = true;
    }
  });
});

function goTo(folderName) {
  window.location.href = `../${folderName}/index.html`;
}
