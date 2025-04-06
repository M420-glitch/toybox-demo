// FINAL VERSION - REPLACE PREVIOUS CODE

// Me Me Health Details Modal
window.openMeMeModal = function(elementType) {
  try {
    // Get token data
    const percentage = playerState.getMeMePercentage ? playerState.getMeMePercentage(elementType) : 75;
    const lastUpdateDate = playerState.getLastMeMeUpdateDate ? playerState.getLastMeMeUpdateDate(elementType) : new Date();
    const daysSinceUpdate = lastUpdateDate ? 
      Math.floor((new Date() - new Date(lastUpdateDate)) / (1000 * 60 * 60 * 24)) : 0;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '99999';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    
    // Create content
    const content = document.createElement('div');
    content.style.backgroundColor = '#222';
    content.style.color = '#fff';
    content.style.padding = '25px';
    content.style.borderRadius = '10px';
    content.style.maxWidth = '600px';
    content.style.maxHeight = '80vh';
    content.style.overflowY = 'auto';
    content.style.position = 'relative';
    
    // Element-specific styling
    if (elementType === 'water') {
      content.style.borderLeft = '5px solid #2196F3';
    } else if (elementType === 'ground') {
      content.style.borderLeft = '5px solid #4caf50';
    } else if (elementType === 'light') {
      content.style.borderLeft = '5px solid #ffeb3b';
    } else if (elementType === 'blow') {
      content.style.borderLeft = '5px solid #f44336';
    }
    
    // Modal HTML content
    content.innerHTML = `
      <h2 style="color: #0f0; text-align: center; margin-bottom: 20px;">${elementType.charAt(0).toUpperCase() + elementType.slice(1)} Me Me Health Details</h2>
      
      <div style="margin: 20px 0;">
        <div style="background-color: #333; height: 20px; border-radius: 10px; overflow: hidden;">
          <div style="background-color: ${percentage >= 80 ? '#0f0' : percentage >= 50 ? '#ff0' : '#f00'}; 
                      height: 100%; width: ${Math.min(percentage, 100)}%;"></div>
        </div>
        <p style="text-align: center; margin-top: 5px;">Current Health: ${percentage.toFixed(1)}%</p>
      </div>
      
      <div style="background-color: #2a2a2a; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h3 style="color: #0f0; margin-bottom: 10px;">How Health Works:</h3>
        <p>Me Me tokens naturally decay over time when not used.</p>
        
        <div style="background-color: #333; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 3px solid #0f0;">
          <p><strong>Decay Formula:</strong></p>
          <p style="font-size: 22px; text-align: center; margin: 15px 0; color: #0f0; font-family: monospace;">
            H(t) = H₀ × e<sup>-λt</sup>
          </p>
          <p>Where:</p>
          <ul style="margin-left: 20px; line-height: 1.5;">
            <li>H(t) = Health at time t</li>
            <li>H₀ = Initial health (100%)</li>
            <li>λ (lambda) = Decay constant (0.05 per day)</li>
            <li>t = Time since last activity (${daysSinceUpdate} days)</li>
          </ul>
        </div>
        
        <div style="background-color: #333; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 3px solid #0ff;">
          <h3 style="color: #0f0; margin-bottom: 10px;">Pledge Benefits:</h3>
          <p>Taking a pledge with a full token (100%) adds:</p>
          <ul style="margin-left: 20px; line-height: 1.5;">
            <li>+1 additional token (100%)</li>
            <li>+0.2 bonus (20%)</li>
            <li>Total: 220% (displayed as 2.2×)</li>
          </ul>
        </div>
        
        <div style="margin-top: 15px;">
          <h3 style="color: #0f0; margin-bottom: 10px;">Health Levels:</h3>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center;">
            <span>80-100%: Healthy</span>
            <div style="width: 80px; height: 10px; background-color: #0f0; border-radius: 5px;"></div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center;">
            <span>50-79%: Fading</span>
            <div style="width: 80px; height: 10px; background-color: #ff0; border-radius: 5px;"></div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center;">
            <span>0-49%: Needs Care</span>
            <div style="width: 80px; height: 10px; background-color: #f00; border-radius: 5px;"></div>
          </div>
        </div>
      </div>
      
      <button style="display: block; margin: 20px auto 5px; padding: 12px 25px; background-color: #0f0; color: #000; 
                     border: none; border-radius: 5px; cursor: pointer; font-family: monospace; font-weight: bold;">
        Close
      </button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Add close button functionality
    const closeButton = modal.querySelector('button');
    closeButton.onclick = function() {
      document.body.removeChild(modal);
    };
    
    // Close when clicking outside content
    modal.onclick = function(e) {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  } catch (e) {
    console.error("Error in Me Me modal:", e);
  }
};

// Add click handlers to images
setTimeout(function() {
  // Add for Progress Map me-me images
  const mapImages = document.querySelectorAll('.me-me img');
  mapImages.forEach(function(img) {
    const type = img.alt.toLowerCase().split(' ')[0];
    img.style.cursor = 'pointer';
    img.setAttribute('title', 'Click for health details');
    img.onclick = function() {
      window.openMeMeModal(type);
      return false;
    };
  });
  
  // Add for XP Summary token images 
  const tokenImages = document.querySelectorAll('.token-icon');
  tokenImages.forEach(function(img) {
    const type = img.alt.toLowerCase().split(' ')[0];
    img.style.cursor = 'pointer';
    img.setAttribute('title', 'Click for health details');
    img.onclick = function() {
      window.openMeMeModal(type);
      return false;
    };
  });
  
  // Keep the emergency test button for now
  const btn = document.createElement('button');
  btn.textContent = "Health Details";
  btn.style.position = 'fixed';
  btn.style.bottom = '10px';
  btn.style.right = '10px';
  btn.style.zIndex = '9999';
  btn.style.padding = '10px';
  btn.style.backgroundColor = '#333';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.cursor = 'pointer';
  btn.onclick = function() { window.openMeMeModal('water'); };
  document.body.appendChild(btn);
}, 1000);