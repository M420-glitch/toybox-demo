document.addEventListener('DOMContentLoaded', () => {
  // Load player state
  playerState.load();
  
  // Update the stats display
  updateStats();
  
  // Setup button event listeners
  document.getElementById('submit-score-button').addEventListener('click', () => {
    playerState.submitToLeaderboard();
  });
  
  document.getElementById('continue-button').addEventListener('click', () => {
    window.location.href = "../ProgressMap/index.html";
  });
  
  document.getElementById('reset-button').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      playerState.clearData();
      updateStats();
      alert("All progress has been reset.");
    }
  });
  
  document.getElementById('logout-button').addEventListener('click', () => {
    if (confirm("Are you sure you want to log out? Your progress will be saved.")) {
      playerState.logout();
    }
  });
  
  function updateStats() {
    // Update XP display
    document.getElementById('total-xp').textContent = playerState.getXP('main');
    
    // Update completed toyboxes count
    document.getElementById('completed-count').textContent = playerState.completed.length;
    
    // Count active Me Me tokens
    let tokenCount = 0;
    for (const token in playerState.meMeTokens) {
      if (playerState.hasMeMe(token)) {
        tokenCount++;
      }
    }
    document.getElementById('tokens-count').textContent = tokenCount;
  }
});