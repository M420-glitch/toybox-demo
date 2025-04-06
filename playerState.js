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

  // New username property
  username: localStorage.getItem('username') || "Guest",

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

  // New method to set username
  setUsername(newUsername) {
    this.username = newUsername;
    localStorage.setItem('username', newUsername);
  },

  // New method to check login status
  isLoggedIn() {
    return !!this.username && this.username.indexOf('Guest') !== 0;
  },

  // New method to logout
  logout() {
    // Only clear username, preserve game progress
    this.username = null;
    localStorage.removeItem('username');
    window.location.href = "../login.html";
  },

  // Modified submitToLeaderboard to include username
  submitToLeaderboard() {
    // If no username is set or using guest account, prompt to set one
    if (!this.username || this.username.indexOf('Guest') === 0) {
      const newUsername = prompt("Please enter a username for the leaderboard:", this.username);
      if (newUsername && newUsername.trim()) {
        this.setUsername(newUsername.trim());
      }
    }
    
    // Redirect to leaderboard
    window.location.href = "../leaderboard.html";
  },

  // Add this method to handle token pledges with 10% extra boost
  takeMeMePledge(elementType) {
    if (this.hasMeMe(elementType)) {
      // Boost token value to 220% when pledge is taken (2.2 instead of 2.0)
      this.meMeTokens[elementType] = 2.2;
      
      // Update max tokens value
      if (this.meMeTokens[elementType] > this.maxTokensEver[elementType]) {
        this.maxTokensEver[elementType] = this.meMeTokens[elementType];
      }
      
      // Save to localStorage
      localStorage.setItem(`${elementType}Tokens`, this.meMeTokens[elementType]);
      localStorage.setItem('maxTokensEver', JSON.stringify(this.maxTokensEver));
      
      return true;
    }
    return false;
  },
};

