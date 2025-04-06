window.addEventListener("DOMContentLoaded", () => {
  playerState.load();
  document.getElementById("xp-display").textContent = playerState.getXP();

  document.querySelectorAll("button[data-xp]").forEach(btn => {
    const requiredXP = parseInt(btn.getAttribute("data-xp"));
    const toyboxId = btn.textContent;
    const toyboxNumber = parseInt(toyboxId);

    let isAccessible = true;

    // Sequential unlocking for Toyboxes 2 onwards
    if (toyboxNumber >= 2) {
      const previousToyboxId = (toyboxNumber - 1).toString();
      if (!playerState.isCompleted(previousToyboxId)) {
        isAccessible = false;
      }
    }

    if (playerState.isCompleted(toyboxId)) {
      btn.classList.add("completed");
    } else if (toyboxNumber < 2 && currentXP >= requiredXP) {
      btn.classList.add("unlocked");
    } else if (toyboxNumber >= 2 && isAccessible) {
      btn.classList.add("unlocked");
    } else {
      btn.disabled = true;
      btn.classList.add("locked");
    }
  });

  // Update Ground Me Me info block
  updateGroundMeMeInfoBlock();
});

function goTo(folderName) {
  window.location.href = `../../${folderName}/index.html`;
}

function goToPledge(pledgeType) {
  switch (pledgeType) {
    case 'water':
      window.location.href = '../../Toybox-4/WaterMeReveal/index.html';
      break;
    case 'ground':
      window.location.href = '../../Toybox-9/GroundMeReveal/index.html';
      break;
    case 'light':
      window.location.href = '../../Toybox-14A/LightMeReveal/index.html';
      break;
    case 'blow':
      window.location.href = '../../Toybox-5/BlowMeReveal/index.html';
      break;
    default:
      console.warn('Unknown pledge token:', pledgeType);
  }
}

function resetProgress() {
  playerState.clearData();
  window.location.reload();
}

function saveAndExit() {
  playerState.save(); // Save the current player state
  window.location.href = "../../ExitScreen/index.html"; // Adjust path if needed
}

function updateGroundMeMeInfoBlock() {
  // Get references to elements
  const infoBlock = document.getElementById('ground-me-me-info-block');
  const pledgeStatus = document.getElementById('pledge-status');
  const tokenCount = document.getElementById('token-count');
  const groundXP = document.getElementById('ground-xp');
  
  // Get current XP to check if Toybox 9 is unlocked (XP ≥ 40)
  const currentXP = playerState.getXP("main");
  
  if (currentXP >= 40) { // Toybox 9 requires 40 XP
    // Unlock the info block
    infoBlock.classList.remove('locked');
    
    // Update info with real values
    pledgeStatus.textContent = playerState.hasTakenPledge('ground') ? 'Taken ✓' : 'Not taken';
    
    // Get token count (defaults to 0 if undefined)
    const tokens = playerState.meMeTokens['ground'] || 0;
    tokenCount.textContent = tokens.toFixed(1);
    
    // Add special indicator for doubled tokens
    if (tokens > 1) {
      const multiplier = document.createElement('span');
      multiplier.className = 'token-multiplier';
      multiplier.textContent = ' (' + tokens.toFixed(1) + '×)';
      multiplier.style.color = '#4CAF50';
      tokenCount.appendChild(multiplier);
    }
    
    // Get Ground XP
    const groundMeMeXP = playerState.getXP('ground') || 0;
    groundXP.textContent = groundMeMeXP;
  } else {
    // Keep it locked
    infoBlock.classList.add('locked');
    
    // Show placeholder values
    pledgeStatus.textContent = '---';
    tokenCount.textContent = '---';
    groundXP.textContent = '---';
  }
}

/**
 * Ground Me Me Progress Map State Manager
 * Handles both locked and unlocked states with a single control point
 */

const GroundMeMapManager = {
  // Store initial state
  state: {
    isLocked: true,
    tokenCount: 0,
    hasPledge: false
  },
  
  // Initialize the page
  init: function() {
    // Load player state
    playerState.load();
    
    // Get token data - CHANGE WATER TO GROUND
    this.state.tokenCount = playerState.meMeTokens.ground || 0;
    this.state.hasPledge = playerState.pledgesTaken.ground || false;
    this.state.isLocked = this.state.tokenCount <= 0;
    
    // Apply appropriate state
    this.updateInfoBlock();
    
    if (this.state.isLocked) {
      this.applyLockedState();
    } else {
      this.applyUnlockedState();
    }
    
    console.log("Ground Me Me map initialized with state:", this.state);
  },
  
  // Apply locked state visuals and interactions
  applyLockedState: function() {
    const container = document.getElementById('container');
    
    // 1. Apply visual indicators
    container.classList.add('locked-content');
    
    // 2. Disable all links
    document.querySelectorAll('#container a').forEach(link => {
      link.classList.add('disabled-link');
      link.setAttribute('data-original-href', link.href);
      link.href = 'javascript:void(0)';
    });
    
    // 3. Disable all buttons except reset
    document.querySelectorAll('#container button:not(#dev-reset-button)').forEach(button => {
      button.disabled = true;
      button.classList.add('disabled-button');
    });
    
    // 4. Add lock overlay and message
    this.addLockOverlay();
    
    // 5. Block all interactions
    this.blockPageInteractions();
  },
  
  // Apply unlocked state
  applyUnlockedState: function() {
    // If they have a pledge, show pledge-specific content
    if (this.state.hasPledge) {
      document.querySelectorAll('.pledge-content').forEach(el => {
        el.style.display = 'block';
      });
    }
    
    // Any future pledge-specific content can be toggled here
  },
  
  // Add lock overlay with return button
  addLockOverlay: function() {
    const overlay = document.createElement('div');
    overlay.id = 'lock-overlay';
    overlay.innerHTML = `
      <div id="unlock-message">
        <h3>🔒 AREA LOCKED</h3>
        <p>Complete Toybox 9 to access this area</p>
        <button id="return-button">Return to Main Progress Map</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Add return button handler
    document.getElementById('return-button').onclick = function() {
      window.location.href = '../index.html';
    };
  },
  
  // Block all page interactions except allowed buttons
  blockPageInteractions: function() {
    document.addEventListener('click', function(e) {
      if (e.target.id !== 'dev-reset-button' && e.target.id !== 'return-button') {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
    }, true);
  },
  
  // Update token info display
  updateInfoBlock: function() {
    const pledgeStatus = document.getElementById('pledge-status');
    const tokenDisplay = document.getElementById('token-count');
    const groundXP = document.getElementById('ground-xp');
    
    if (pledgeStatus && tokenDisplay) {
      pledgeStatus.textContent = this.state.hasPledge ? 'Taken ✓' : 'Not taken';
      tokenDisplay.textContent = this.state.tokenCount.toFixed(1);
      
      if (groundXP) {
        const xpValue = this.state.hasPledge ? 10 : (this.state.tokenCount > 0 ? 5 : 0);
        groundXP.textContent = xpValue;
      }
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  GroundMeMapManager.init();
});
