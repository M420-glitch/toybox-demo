// XP Summary page functionality
document.addEventListener('DOMContentLoaded', () => {
  playerState.load();
  updateTokenDisplay();
  
  // Set up pledge buttons
  document.querySelectorAll('.pledge-button').forEach(btn => {
    const elementType = btn.dataset.element;
    updatePledgeButtonState(elementType);
  });
  
  // Developer controls already set up in the HTML
});

// Update token display
function updateTokenDisplay() {
  // Update all tokens display
  ["water", "ground", "light", "blow"].forEach(element => {
    const percentage = playerState.getMeMePercentage(element);
    const healthBar = document.getElementById(`${element}-health-bar`);
    const percentText = document.getElementById(`${element}-tokens-percent`);
    const statusMessage = document.getElementById(`${element}-status-message`);
    
    if (playerState.hasMeMe(element)) {
      // Update percentage text with actual value (can be over 100%)
      percentText.textContent = `${percentage}%`;
      
      // Cap health bar at 100% width for visual display
      healthBar.style.width = `${Math.min(percentage, 100)}%`;
      
      // Add token multiplier if over 100%
      if (percentage > 100) {
        healthBar.classList.add('doubled');
        
        // Visual indicator for boosted token
        if (!document.querySelector(`.${element}-multiplier`)) {
          const tokenContainer = document.querySelector(`.token-container.${element}`);
          const multiplier = document.createElement('div');
          multiplier.className = `${element}-multiplier token-multiplier`;
          multiplier.innerHTML = `<span>2.2×</span><div class="boost-tag">WMM</div>`;
          tokenContainer.appendChild(multiplier);
        }
        
        // Update status message
        statusMessage.textContent = "Your Me Me is boosted by your pledge!";
      }
      
      // Update pledge button
      updatePledgeButtonState(element);
    }
  });
}

function updatePledgeButtonState(elementType) {
  const pledgeButton = document.querySelector(`button[data-element="${elementType}"]`);
  if (!pledgeButton) return;
  
  const percentage = playerState.getMeMePercentage(elementType);
  
  if (percentage >= 200) {
    pledgeButton.disabled = true;
    pledgeButton.textContent = "Pledge Active ✓";
    pledgeButton.classList.add('pledge-taken');
  } else if (percentage >= 100) {
    pledgeButton.disabled = false;
    pledgeButton.textContent = "Take Pledge";
  } else {
    pledgeButton.disabled = true;
    pledgeButton.textContent = "Needs Your Pledge";
  }
}

function takePledge(elementType) {
  if (playerState.hasMeMe(elementType)) {
    const percentage = playerState.getMeMePercentage(elementType);
    
    if (percentage >= 100 && percentage < 200) {
      if (confirm(`Do you pledge to protect and nurture ${elementType} in your community?`)) {
        playerState.takeMeMePledge(elementType);
        updateTokenDisplay();
        
        // Show success message
        alert(`You now have 2.2 ${elementType} Me Me Tokens! (220% - includes 10% boost)`);
      }
    } else if (percentage >= 200) {
      alert(`You've already taken the ${elementType} pledge!`);
    } else {
      alert(`Your ${elementType} Me Me needs to be at full health before you can take the pledge.`);
    }
  } else {
    alert(`You need to earn the ${elementType} Me Me first!`);
  }
}

// Add these navigation functions
function goToMap() {
  playerState.save();
  window.location.href = "../ProgressMap/index.html";
}

function saveAndExit() {
  playerState.save();
  window.location.href = "../ExitScreen/index.html";
}