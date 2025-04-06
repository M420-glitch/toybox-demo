document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  if (localStorage.getItem('username')) {
    redirectToGame();
  }
  
  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const formPanels = document.querySelectorAll('.form-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show corresponding form panel
      formPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${targetTab}-panel`) {
          panel.classList.add('active');
        }
      });
    });
  });
  
  // Login form submission
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    
    if (username) {
      saveUserAndRedirect(username);
    }
  });
  
  // Sign up form submission
  document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value.trim();
    
    if (username) {
      saveUserAndRedirect(username);
    }
  });
  
  // Guest login
  document.getElementById('guest-button').addEventListener('click', () => {
    const guestName = `Guest${Math.floor(Math.random() * 10000)}`;
    saveUserAndRedirect(guestName);
  });
  
  // Helper functions
  function saveUserAndRedirect(username) {
    // Store username in localStorage
    localStorage.setItem('username', username);
    
    // Initialize player state if needed
    if (!localStorage.getItem('mainXP')) {
      localStorage.setItem('mainXP', 0);
    }
    
    // Show welcome message
    alert(`Welcome, ${username}! Let's play!`);
    
    // Redirect to game
    redirectToGame();
  }
  
  function redirectToGame() {
    window.location.href = "ProgressMap/index.html";
  }
});