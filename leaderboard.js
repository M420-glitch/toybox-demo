window.playerState = {
  xp: {
    main: parseInt(localStorage.getItem('mainXP')) || 0,
    water: parseInt(localStorage.getItem('waterXP')) || 0,
    ground: parseInt(localStorage.getItem('groundXP')) || 0,
    light: parseInt(localStorage.getItem('lightXP')) || 0,
    blow: parseInt(localStorage.getItem('blowXP')) || 0,
  },
  meMeTokens: {
    water: parseFloat(localStorage.getItem('waterTokens')) || 0,
    ground: parseFloat(localStorage.getItem('groundTokens')) || 0,
    light: parseFloat(localStorage.getItem('lightTokens')) || 0,
    blow: parseFloat(localStorage.getItem('blowTokens')) || 0,
  },
  completed: JSON.parse(localStorage.getItem('completedToyboxes')) || [],
  meMes: JSON.parse(localStorage.getItem('meMes')) || {},

  tokenLastEarnedDate: JSON.parse(localStorage.getItem('tokenLastEarnedDate')) || {
    water: null,
    ground: null, 
    light: null,
    blow: null
  },
  maxTokensEver: JSON.parse(localStorage.getItem('maxTokensEver')) || {
    water: 0,
    ground: 0,
    light: 0,
    blow: 0
  },

  markCompleted(toyboxId) {
    if (!this.completed.includes(toyboxId)) {
      this.completed.push(toyboxId);
      localStorage.setItem('completedToyboxes', JSON.stringify(this.completed));
    }
  },

  isCompleted(toyboxId) {
    return this.completed.includes(toyboxId);
  },

  markMeMeEarned(token) {
    this.meMeTokens[token] = 1.0;
    const now = new Date().toISOString();
    this.tokenLastEarnedDate[token] = now;
    if (this.meMeTokens[token] > this.maxTokensEver[token]) {
      this.maxTokensEver[token] = this.meMeTokens[token];
    }
    localStorage.setItem(`${token}Tokens`, this.meMeTokens[token]);
    localStorage.setItem('tokenLastEarnedDate', JSON.stringify(this.tokenLastEarnedDate));
    localStorage.setItem('maxTokensEver', JSON.stringify(this.maxTokensEver));
    localStorage.setItem('meMes', JSON.stringify(this.meMes));
  },

  hasMeMe(token) {
    return this.meMeTokens[token] >= 0.5;
  },

  getMeMePercentage(token) {
    return Math.round(this.meMeTokens[token] * 100);
  },

  calculateTokenDecay() {
    const now = new Date();
    const decayRate = 0.002;
    for (const token in this.meMeTokens) {
      if (!this.tokenLastEarnedDate[token]) continue;
      const lastEarned = new Date(this.tokenLastEarnedDate[token]);
      const daysSinceEarned = (now - lastEarned) / (1000 * 60 * 60 * 24);
      if (daysSinceEarned >= 1) {
        const currentValue = this.meMeTokens[token];
        const decayedValue = currentValue * Math.exp(-decayRate * daysSinceEarned);
        const minimumValue = this.maxTokensEver[token] * 0.2;
        this.meMeTokens[token] = Math.max(decayedValue, minimumValue);
        localStorage.setItem(`${token}Tokens`, this.meMeTokens[token]);
      }
    }
  },

  save() {
    localStorage.setItem('mainXP', this.xp.main);
    localStorage.setItem('waterXP', this.xp.water);
    localStorage.setItem('groundXP', this.xp.ground);
    localStorage.setItem('lightXP', this.xp.light);
    localStorage.setItem('blowXP', this.xp.blow);

    localStorage.setItem('waterTokens', this.meMeTokens.water);
    localStorage.setItem('groundTokens', this.meMeTokens.ground);
    localStorage.setItem('lightTokens', this.meMeTokens.light);
    localStorage.setItem('blowTokens', this.meMeTokens.blow);
    localStorage.setItem('completedToyboxes', JSON.stringify(this.completed));
  },

  clearData() {
    localStorage.clear();
    this.xp = { main: 0, water: 0, ground: 0, light: 0, blow: 0 };
    this.completed = [];
  },

  getXP(world) {
    return this.xp[world] || 0;
  },

  addXP(world, amount) {
    this.xp[world] = (this.xp[world] || 0) + amount;
    localStorage.setItem(`${world}XP`, this.xp[world]);
  },

  load() {
    this.xp = {
      main: parseInt(localStorage.getItem('mainXP')) || 0,
      water: parseInt(localStorage.getItem('waterXP')) || 0,
      ground: parseInt(localStorage.getItem('groundXP')) || 0,
      light: parseInt(localStorage.getItem('lightXP')) || 0,
      blow: parseInt(localStorage.getItem('blowXP')) || 0,
    };
    this.meMeTokens = {
      water: parseFloat(localStorage.getItem('waterTokens')) || 0,
      ground: parseFloat(localStorage.getItem('groundTokens')) || 0,
      light: parseFloat(localStorage.getItem('lightTokens')) || 0,
      blow: parseFloat(localStorage.getItem('blowTokens')) || 0,
    };
    this.completed = JSON.parse(localStorage.getItem('completedToyboxes')) || [];
    this.meMes = JSON.parse(localStorage.getItem('meMes')) || {};
    this.tokenLastEarnedDate = JSON.parse(localStorage.getItem('tokenLastEarnedDate')) || {
      water: null, ground: null, light: null, blow: null
    };
    this.maxTokensEver = JSON.parse(localStorage.getItem('maxTokensEver')) || {
      water: 0, ground: 0, light: 0, blow: 0
    };
    this.calculateTokenDecay();
  },
};

// Firebase configuration - you'll need to add your Firebase details
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Player state management
let username = localStorage.getItem('username') || `Guest${Math.floor(Math.random() * 10000)}`;
let currentTab = 'xp';

document.addEventListener('DOMContentLoaded', () => {
  // Load player state
  playerState.load();
  
  // Setup username field
  const usernameInput = document.getElementById('username-input');
  usernameInput.value = username;
  
  // Username save button
  document.getElementById('save-username').addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
      localStorage.setItem('username', username);
      alert(`Username saved as: ${username}`);
      // Update score with new username
      updatePlayerScore();
    }
  });
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentTab = button.getAttribute('data-tab');
      loadLeaderboard(currentTab);
    });
  });
  
  // Back button
  document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = "ProgressMap/index.html";
  });
  
  // Initial leaderboard load
  loadLeaderboard('xp');
  
  // Update player score when page loads
  updatePlayerScore();
});

// Load leaderboard data
function loadLeaderboard(type) {
  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = '<tr><td colspan="4">Loading leaderboard...</td></tr>';
  
  let query;
  let scoreField;
  
  switch(type) {
    case 'xp':
      query = db.collection('players').orderBy('mainXP', 'desc').limit(20);
      scoreField = 'mainXP';
      break;
    case 'tokens':
      query = db.collection('players').orderBy('tokensCount', 'desc').limit(20);
      scoreField = 'tokensCount';
      break;
    case 'completed':
      query = db.collection('players').orderBy('completedCount', 'desc').limit(20);
      scoreField = 'completedCount';
      break;
  }
  
  query.get().then((snapshot) => {
    if (snapshot.empty) {
      leaderboardBody.innerHTML = '<tr><td colspan="4">No scores yet! Be the first to submit.</td></tr>';
      return;
    }
    
    leaderboardBody.innerHTML = '';
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      const row = document.createElement('tr');
      
      // Highlight the current player
      if (data.username === username) {
        row.classList.add('current-player');
      }
      
      const lastActiveDate = data.lastActive ? new Date(data.lastActive).toLocaleDateString() : 'N/A';
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${data.username}</td>
        <td>${data[scoreField]}</td>
        <td>${lastActiveDate}</td>
      `;
      
      leaderboardBody.appendChild(row);
    });
  }).catch(error => {
    console.error("Error getting leaderboard: ", error);
    leaderboardBody.innerHTML = '<tr><td colspan="4">Error loading leaderboard. Please try again later.</td></tr>';
  });
}

// Update player score in Firestore
function updatePlayerScore() {
  // Calculate token count
  let tokensCount = 0;
  for (const token in playerState.meMeTokens) {
    if (playerState.meMeTokens[token] > 0) {
      tokensCount++;
    }
  }
  
  // Prepare player data
  const playerData = {
    username: username,
    mainXP: playerState.getXP("main"),
    waterXP: playerState.getXP("water"),
    groundXP: playerState.getXP("ground"),
    lightXP: playerState.getXP("light"),
    blowXP: playerState.getXP("blow"),
    tokensCount: tokensCount,
    completedCount: playerState.completed.length,
    lastActive: new Date().toISOString()
  };
  
  // Save to Firestore (using username as document ID)
  db.collection('players').doc(username).set(playerData)
    .then(() => {
      console.log("Score successfully updated!");
      // Refresh the current leaderboard
      loadLeaderboard(currentTab);
    })
    .catch((error) => {
      console.error("Error updating score: ", error);
    });
}

