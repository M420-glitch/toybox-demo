// Root Hack - Main Application Logic

const app = {
  state: {
    initialized: false,
    challengesCompleted: 0,
    totalChallenges: 5,
    currentChallenge: null,
    xpEarned: 0,
    rewardsGranted: false,
    rootNodesUnlocked: []
  },

  init: function() {
    // Load player state from global playerState object
    if (typeof playerState !== 'undefined') {
      playerState.load();
      
      // Check if player has already completed this toybox
      const alreadyCompleted = playerState.isCompleted('root-hack');
      if (alreadyCompleted) {
        this.showAlreadyCompletedMessage();
        return;
      }
      
      // Display current XP
      this.updateXPDisplay();
    }

    // Initialize terminal
    terminal.init();
    
    // Initialize root system visualization
    rootSystem.init();
    
    // Setup event listeners
    this.setupEventListeners();
    
    this.state.initialized = true;
    
    // If dev mode, unlock all challenges (for testing)
    if (window.location.search.includes('dev=true')) {
      this.devUnlockAll();
    }
  },
  
  setupEventListeners: function() {
    // Challenge submit button
    document.getElementById('challenge-submit').addEventListener('click', () => {
      this.submitChallengeAnswer();
    });
    
    // Claim rewards button
    document.getElementById('claim-rewards').addEventListener('click', () => {
      this.claimRewards();
    });
    
    // Return to map button
    document.getElementById('return-to-map').addEventListener('click', () => {
      window.location.href = '../../index.html';
    });
    
    // Terminal controls (minimize, maximize, close)
    document.querySelector('.minimize').addEventListener('click', () => {
      terminal.toggleMinimize();
    });
    
    document.querySelector('.maximize').addEventListener('click', () => {
      terminal.toggleMaximize();
    });
    
    document.querySelector('.close').addEventListener('click', () => {
      terminal.addOutput(`Cannot close terminal! ROOT_HACK protocol is still running.`, 'error-msg');
    });
  },
  
  updateXPDisplay: function() {
    const xpDisplay = document.getElementById('xp-display');
    xpDisplay.textContent = `${this.state.xpEarned}/${this.state.totalChallenges}`;
  },
  
  startChallenge: function(challengeId) {
    const challenge = this.getChallengeById(challengeId);
    if (!challenge) return;
    
    this.state.currentChallenge = challenge;
    
    // Show challenge container
    const challengeContainer = document.getElementById('challenge-container');
    challengeContainer.classList.remove('hidden');
    
    // Update challenge content
    document.getElementById('challenge-title').textContent = challenge.title;
    document.getElementById('challenge-content').innerHTML = challenge.description;
    
    // Create input fields based on challenge type
    const inputArea = document.getElementById('challenge-input-area');
    inputArea.innerHTML = '';
    
    if (challenge.type === 'text') {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'challenge-text-input';
      input.placeholder = challenge.placeholder || 'Enter your answer...';
      inputArea.appendChild(input);
      
      // Focus on input
      setTimeout(() => input.focus(), 100);
      
      // Add event listener for enter key
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          this.submitChallengeAnswer();
        }
      });
    } 
    else if (challenge.type === 'multiple-choice') {
      const select = document.createElement('select');
      select.id = 'challenge-select-input';
      
      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select an answer...';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);
      
      // Add challenge options
      challenge.options.forEach((option, index) => {
        const optionEl = document.createElement('option');
        optionEl.value = index;
        optionEl.textContent = option;
        select.appendChild(optionEl);
      });
      
      inputArea.appendChild(select);
    }
    else if (challenge.type === 'pattern') {
      challenge.pattern.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('pattern-row');
        rowDiv.style.display = 'flex';
        rowDiv.style.gap = '5px';
        rowDiv.style.marginBottom = '5px';
        
        row.forEach((cell, cellIndex) => {
          const button = document.createElement('button');
          button.classList.add('pattern-cell');
          button.dataset.row = rowIndex;
          button.dataset.cell = cellIndex;
          button.textContent = cell === 1 ? '•' : ' ';
          button.style.width = '40px';
          button.style.height = '40px';
          button.style.backgroundColor = 'rgba(45, 45, 45, 0.6)';
          button.style.border = '1px solid var(--accent-color)';
          button.style.borderRadius = '4px';
          button.style.cursor = 'pointer';
          
          button.addEventListener('click', () => {
            const currentValue = challenge.pattern[rowIndex][cellIndex];
            challenge.pattern[rowIndex][cellIndex] = currentValue === 1 ? 0 : 1;
            button.textContent = challenge.pattern[rowIndex][cellIndex] === 1 ? '•' : ' ';
            button.style.backgroundColor = challenge.pattern[rowIndex][cellIndex] === 1 
              ? 'var(--accent-color)' 
              : 'rgba(45, 45, 45, 0.6)';
          });
          
          rowDiv.appendChild(button);
        });
        
        inputArea.appendChild(rowDiv);
      });
    }
    
    // Show submit button
    const submitButton = document.getElementById('challenge-submit');
    submitButton.classList.remove('hidden');
    
    // Activate corresponding node in visualization
    rootSystem.activateNode(challengeId);
  },
  
  submitChallengeAnswer: function() {
    const challenge = this.state.currentChallenge;
    if (!challenge) return;
    
    let userAnswer;
    let isCorrect = false;
    
    // Get user answer based on challenge type
    if (challenge.type === 'text') {
      const input = document.getElementById('challenge-text-input');
      userAnswer = input.value.trim().toLowerCase();
      isCorrect = this.checkTextAnswer(userAnswer, challenge.answer);
    } 
    else if (challenge.type === 'multiple-choice') {
      const select = document.getElementById('challenge-select-input');
      userAnswer = parseInt(select.value);
      isCorrect = userAnswer === challenge.correctIndex;
    }
    else if (challenge.type === 'pattern') {
      userAnswer = challenge.pattern;
      isCorrect = this.checkPatternAnswer(userAnswer, challenge.correctPattern);
    }
    
    // Handle result
    if (isCorrect) {
      this.completeChallenge(challenge.id);
    } else {
      terminal.addOutput(`Challenge '${challenge.title}' failed. Try again.`, 'error-msg');
      terminal.shake();
    }
  },
  
  checkTextAnswer: function(userAnswer, correctAnswer) {
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.some(answer => userAnswer === answer.toLowerCase());
    }
    return userAnswer === correctAnswer.toLowerCase();
  },
  
  checkPatternAnswer: function(userPattern, correctPattern) {
    // Flatten both patterns for easy comparison
    const flatUser = userPattern.flat().join('');
    const flatCorrect = correctPattern.flat().join('');
    return flatUser === flatCorrect;
  },
  
  completeChallenge: function(challengeId) {
    // Update state
    this.state.challengesCompleted++;
    this.state.xpEarned++;
    this.state.rootNodesUnlocked.push(challengeId);
    this.updateXPDisplay();
    
    // Update root system visualization
    rootSystem.unlockNode(challengeId);
    
    // Update access level display
    if (this.state.challengesCompleted >= this.state.totalChallenges) {
      document.getElementById('access-level').textContent = 'GRANTED';
      document.getElementById('access-level').classList.add('granted');
    }
    
    // Clear challenge display
    document.getElementById('challenge-container').classList.add('hidden');
    
    // Add success message to terminal
    terminal.addOutput(`Challenge completed successfully! ${this.state.challengesCompleted}/${this.state.totalChallenges} root nodes accessed.`, 'success-msg');
    
    // If all challenges complete, show rewards
    if (this.state.challengesCompleted >= this.state.totalChallenges) {
      this.showRewards();
    }
  },
  
  showRewards: function() {
    setTimeout(() => {
      document.getElementById('rewards-panel').classList.remove('hidden');
      document.getElementById('overlay').classList.remove('hidden');
      
      // Add celebration effect
      rootSystem.celebrate();
      
      // Add completion message to terminal
      terminal.addOutput(`-------------------`, 'system-msg');
      terminal.addOutput(`ROOT ACCESS GRANTED`, 'success-msg');
      terminal.addOutput(`All 5 root nodes successfully accessed`, 'success-msg');
      terminal.addOutput(`System compromised. Earth secrets unlocked.`, 'success-msg');
      terminal.addOutput(`-------------------`, 'system-msg');
    }, 1000);
  },
  
  claimRewards: function() {
    if (this.state.rewardsGranted) return;
    
    // Update player state
    if (typeof playerState !== 'undefined') {
      // Add XP
      playerState.addXP('main', 5);
      
      // Add Ground Me Me token (fraction)
      const currentGroundTokens = playerState.meMeTokens.ground || 0;
      playerState.meMeTokens.ground = currentGroundTokens + 0.2;
      
      // Mark challenge as completed
      playerState.markCompleted('root-hack');
      
      // Save state
      playerState.save();
      
      this.state.rewardsGranted = true;
      
      // Update button
      document.getElementById('claim-rewards').textContent = 'CLAIMED!';
      document.getElementById('claim-rewards').disabled = true;
      
      // Terminal message
      terminal.addOutput(`Rewards claimed! +5 XP and +0.2 Ground Me Me Tokens added to your account.`, 'success-msg');
    } else {
      terminal.addOutput(`ERROR: Could not access player state. Rewards not granted.`, 'error-msg');
    }
  },
  
  showAlreadyCompletedMessage: function() {
    // Add message to terminal
    terminal.addOutput(`ROOT_HACK PREVIOUSLY COMPLETED`, 'system-msg');
    terminal.addOutput(`This node has already been accessed.`, 'system-msg');
    terminal.addOutput(`Rewards already claimed.`, 'system-msg');
    
    // Show all nodes as unlocked
    rootSystem.unlockAllNodes();
    
    // Update access level display
    document.getElementById('access-level').textContent = 'GRANTED';
    document.getElementById('access-level').classList.add('granted');
    
    // Update XP display
    document.getElementById('xp-display').textContent = `5/5`;
  },
  
  // Get challenge data by ID
  getChallengeById: function(id) {
    return this.challenges.find(challenge => challenge.id === id);
  },
  
  // For development use only
  devUnlockAll: function() {
    terminal.addOutput(`DEV MODE ACTIVATED - Unlocking all challenges`, 'system-msg');
    this.challenges.forEach(challenge => {
      this.completeChallenge(challenge.id);
    });
  },
  
  // Challenge definitions
  challenges: [
    {
      id: 'node1',
      title: 'Root Password Bypass',
      type: 'text',
      description: `To access the root network, you need to crack the soil password.<br><br>
                   <span class="cmd">HINT:</span> It's a 5-letter word. "Where plants anchor themselves and nutrients flow."`,
      answer: ['roots', 'earth', 'mycel'],
      placeholder: 'Enter root password...'
    },
    {
      id: 'node2',
      title: 'Mycorrhizal Network Authentication',
      type: 'multiple-choice',
      description: `Fungi connect 90% of land plants in an underground information network.<br><br>
                   <span class="cmd">TASK:</span> Select the correct protocol to access the fungal network:`,
      options: [
        'HTTP (Hyphal Transfer Protocol)',
        'FTP (Fungal Transmission Protocol)',
        'SSH (Soil Symbiotic Handshake)',
        'SMTP (Subterranean Mycorrhizal Transfer Protocol)'
      ],
      correctIndex: 2
    },
    {
      id: 'node3',
      title: 'Root Data Decryption',
      type: 'text',
      description: `The data packets flowing through the root system are encrypted.<br><br>
                   <span class="cmd">DECRYPT:</span> "IVNHF" by shifting each letter one place forward in the alphabet.`,
      answer: ['jwoig', 'fungi']
    },
    {
      id: 'node4',
      title: 'Earthworm Traversal Algorithm',
      type: 'pattern',
      description: `Earthworms have created pathways through the soil. Recreate the optimal path pattern.<br><br>
                   <span class="cmd">INSTRUCTIONS:</span> Click cells to toggle their state until they match the pattern described in the terminal logs.<br><br>
                   <pre>─ ┘ │ ┌ ─</pre>`,
      pattern: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
      correctPattern: [
        [1, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0]
      ]
    },
    {
      id: 'node5',
      title: 'Soil Composition Analysis',
      type: 'multiple-choice',
      description: `The final root node is protected by a soil composition verification check.<br><br>
                   <span class="cmd">QUESTION:</span> Which of the following is NOT typically found in soil?`,
      options: [
        'Humus',
        'Silicon',
        'Quantum fluctuations',
        'Microorganisms'
      ],
      correctIndex: 2
    }
  ]
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});