/* filepath: c:\Users\mites\Desktop\GVA-Toyboxes\Toybox-9\GroundMeReveal\root-hack\main.js */
/**
 * Main controller for the Root Hack experience
 * Manages game state, challenges, and interactions with playerState
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize player state
  if (typeof playerState !== 'undefined') {
    playerState.load();
  }
  
  // Game state
  const gameState = {
    xpEarned: 0,
    maxXP: 5,
    tokensEarned: 0,
    challengesCompleted: 0,
    rootAccessGranted: false,
    alreadyCompleted: false
  };
  
  // Check if this toybox was already completed
  if (typeof playerState !== 'undefined') {
    const toyboxId = 'ground-root-hack';
    gameState.alreadyCompleted = playerState.isCompleted(toyboxId);
    
    if (gameState.alreadyCompleted) {
      gameState.xpEarned = gameState.maxXP;
      updateXPDisplay();
      document.getElementById('access-level').textContent = 'GRANTED';
      document.getElementById('access-level').classList.add('granted');
    }
  }
  
  // Define the hacking challenges
  const challenges = [
    {
      id: 0,
      title: 'Mycelial Network Authentication',
      description: 'Bypass the authentication system by solving the fungi-based encryption pattern. Identify the correct sequence to continue.',
      completed: false,
      type: 'pattern',
      data: {
        correctPattern: [1, 3, 2, 4],
        options: ['🍄', '🌱', '🌿', '🌲']
      }
    },
    {
      id: 1,
      title: 'Root System Pathfinding',
      description: 'Find the optimal path through the root system. Connect the seed to the deepest node without intersecting with toxic soil.',
      completed: false,
      type: 'path',
      data: {
        grid: [
          [0, 1, 0, 0, 1],
          [0, 0, 0, 1, 0],
          [1, 0, 1, 0, 0],
          [0, 0, 0, 0, 1],
          [0, 1, 0, 0, 0]
        ],
        // 0 = empty, 1 = toxic soil
        start: {x: 2, y: 0},
        end: {x: 4, y: 4}
      }
    },
    {
      id: 2,
      title: 'Decode Baron\'s Encryption',
      description: 'The Baron has encrypted their soil data with a simple substitution cipher. Decode the message to gain access to the next level.',
      completed: false,
      type: 'cipher',
      data: {
        ciphertext: 'QCAOR KPVVKP EPCZ LNGGVJ QCNMY LZKKVJ',
        hint: 'Shift each letter 15 positions in the alphabet',
        solution: 'BARON LITTLE WORM TUNNELS BRING POLLEN'
      }
    },
    {
      id: 3,
      title: 'Soil Composition Analysis',
      description: 'Analyze the soil composition to find the unstable element. Match each element with its correct percentage in the soil.',
      completed: false,
      type: 'matching',
      data: {
        elements: ['Carbon', 'Nitrogen', 'Phosphorus', 'Potassium', 'Calcium'],
        values: ['45%', '12%', '8%', '3%', '2%'],
        correctMatches: {
          'Carbon': '45%',
          'Nitrogen': '12%',
          'Phosphorus': '8%',
          'Potassium': '3%',
          'Calcium': '2%'
        }
      }
    },
    {
      id: 4,
      title: 'Root Access Override',
      description: 'Final challenge: Enter the correct 6-digit sequencing key to override the root access protocols. The digits add up to 42, and the first digit is twice the last.',
      completed: false,
      type: 'code',
      data: {
        correctCode: '124862',
        hints: [
          'The digits add up to 42',
          'The first digit is twice the last',
          'The 3rd and 4th digits are consecutive numbers',
          'All digits are unique'
        ]
      }
    }
  ];
  
  // Initialize components
  const rootSystem = new RootSystem();
  const terminal = new Terminal(challenges);
  
  // Initialize challenge handlers
  const challengeContainer = document.getElementById('challenge-container');
  const challengeTitle = document.getElementById('challenge-title');
  const challengeContent = document.getElementById('challenge-content');
  const challengeInputArea = document.getElementById('challenge-input-area');
  const challengeSubmitButton = document.getElementById('challenge-submit');
  
  // Update XP display
  function updateXPDisplay() {
    document.getElementById('xp-display').textContent = `${gameState.xpEarned}/${gameState.maxXP}`;
  }
  
  // Handle starting a challenge
  document.addEventListener('startChallenge', function(e) {
    const challengeId = e.detail.challengeId;
    const challenge = challenges[challengeId];
    
    if (challenge.completed) {
      terminal.print(`\nChallenge ${challengeId + 1} has already been completed!`, 'success');
      return;
    }
    
    // Show the challenge container
    challengeContainer.classList.remove('hidden');
    challengeTitle.textContent = `Challenge ${challengeId + 1}: ${challenge.title}`;
    challengeContent.textContent = challenge.description;
    
    // Clear previous inputs
    challengeInputArea.innerHTML = '';
    
    // Create challenge-specific input
    createChallengeInput(challenge);
    
    // Show submit button
    challengeSubmitButton.classList.remove('hidden');
    
    // Set up submit handler
    challengeSubmitButton.onclick = function() {
      checkChallengeAnswer(challenge);
    };
  });
  
  // Create the input UI for a challenge
  function createChallengeInput(challenge) {
    switch (challenge.type) {
      case 'pattern':
        createPatternInput(challenge);
        break;
      case 'path':
        createPathInput(challenge);
        break;
      case 'cipher':
        createCipherInput(challenge);
        break;
      case 'matching':
        createMatchingInput(challenge);
        break;
      case 'code':
        createCodeInput(challenge);
        break;
    }
  }
  
  // Create pattern input
  function createPatternInput(challenge) {
    const patternDiv = document.createElement('div');
    patternDiv.className = 'pattern-challenge';
    
    const instructions = document.createElement('p');
    instructions.textContent = 'Select the correct sequence:';
    patternDiv.appendChild(instructions);
    
    const options = challenge.data.options;
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'pattern-buttons';
    
    const userPattern = [];
    const patternDisplay = document.createElement('div');
    patternDisplay.className = 'pattern-display';
    patternDisplay.textContent = 'Your sequence: ';
    
    options.forEach((option, index) => {
      const button = document.createElement('button');
      button.textContent = option;
      button.dataset.index = index;
      button.onclick = function() {
        userPattern.push(index);
        patternDisplay.textContent = 'Your sequence: ' + userPattern.map(i => options[i]).join(' ');
        
        // If they've selected enough options, enable the submit button
        if (userPattern.length === challenge.data.correctPattern.length) {
          challengeSubmitButton.disabled = false;
        }
      };
      buttonContainer.appendChild(button);
    });
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.onclick = function() {
      userPattern.length = 0;
      patternDisplay.textContent = 'Your sequence: ';
      challengeSubmitButton.disabled = true;
    };
    buttonContainer.appendChild(resetButton);
    
    patternDiv.appendChild(buttonContainer);
    patternDiv.appendChild(patternDisplay);
    
    challengeInputArea.appendChild(patternDiv);
    
    // Store the user pattern for checking later
    challengeInputArea.dataset.userPattern = JSON.stringify(userPattern);
    
    // Disable submit until they make a selection
    challengeSubmitButton.disabled = true;
  }
  
  // Create path input
  function createPathInput(challenge) {
    const pathDiv = document.createElement('div');
    pathDiv.className = 'path-challenge';
    
    const grid = challenge.data.grid;
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    
    // Create path data structure to track user's path
    const userPath = [];
    userPath.push({x: challenge.data.start.x, y: challenge.data.start.y});
    
    // Create the grid
    for (let y = 0; y < grid.length; y++) {
      const row = document.createElement('div');
      row.className = 'grid-row';
      
      for (let x = 0; x < grid[y].length; x++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        
        // Mark toxic soil
        if (grid[y][x] === 1) {
          cell.classList.add('toxic');
        }
        
        // Mark start and end points
        if (x === challenge.data.start.x && y === challenge.data.start.y) {
          cell.classList.add('start');
          cell.textContent = 'S';
        } else if (x === challenge.data.end.x && y === challenge.data.end.y) {
          cell.classList.add('end');
          cell.textContent = 'E';
        }
        
        // Add click handler
        cell.addEventListener('click', function() {
          const cellX = parseInt(this.dataset.x);
          const cellY = parseInt(this.dataset.y);
          
          // Can't click on toxic cells
          if (grid[cellY][cellX] === 1) {
            return;
          }
          
          // Can only click on adjacent cells to the last path element
          const lastCell = userPath[userPath.length - 1];
          const isAdjacent = (
            (Math.abs(cellX - lastCell.x) === 1 && cellY === lastCell.y) ||
            (Math.abs(cellY - lastCell.y) === 1 && cellX === lastCell.x)
          );
          
          if (!isAdjacent) {
            return;
          }
          
          // Add to path
          userPath.push({x: cellX, y: cellY});
          this.classList.add('path');
          
          // Check if we reached the end
          if (cellX === challenge.data.end.x && cellY === challenge.data.end.y) {
            challengeSubmitButton.disabled = false;
          }
        });
        
        row.appendChild(cell);
      }
      
      gridContainer.appendChild(row);
    }
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Path';
    resetButton.onclick = function() {
      userPath.length = 0;
      userPath.push({x: challenge.data.start.x, y: challenge.data.start.y});
      
      // Clear path markers
      document.querySelectorAll('.grid-cell.path').forEach(cell => {
        cell.classList.remove('path');
      });
      
      challengeSubmitButton.disabled = true;
    };
    
    pathDiv.appendChild(gridContainer);
    pathDiv.appendChild(resetButton);
    
    challengeInputArea.appendChild(pathDiv);
    
    // Store the user path for checking later
    challengeInputArea.dataset.userPath = JSON.stringify(userPath);
    
    // Disable submit until they reach the end
    challengeSubmitButton.disabled = true;
  }
  
  // Create cipher input
  function createCipherInput(challenge) {
    const cipherDiv = document.createElement('div');
    cipherDiv.className = 'cipher-challenge';
    
    const ciphertext = document.createElement('p');
    ciphertext.className = 'ciphertext';
    ciphertext.textContent = challenge.data.ciphertext;
    
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Hint: ' + challenge.data.hint;
    
    const label = document.createElement('label');
    label.textContent = 'Enter your decoded message:';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'challenge-input cipher-input';
    input.placeholder = 'Your decoded message...';
    
    cipherDiv.appendChild(ciphertext);
    cipherDiv.appendChild(hint);
    cipherDiv.appendChild(label);
    cipherDiv.appendChild(input);
    
    challengeInputArea.appendChild(cipherDiv);
    
    // Enable submit button
    challengeSubmitButton.disabled = false;
  }
  
  // Create matching input
  function createMatchingInput(challenge) {
    const matchingDiv = document.createElement('div');
    matchingDiv.className = 'matching-challenge';
    
    const instructions = document.createElement('p');
    instructions.textContent = 'Match each element to its percentage in the soil:';
    matchingDiv.appendChild(instructions);
    
    // Create the matching UI
    const matchContainer = document.createElement('div');
    matchContainer.className = 'match-container';
    
    // Shuffle values
    const shuffledValues = [...challenge.data.values];
    shuffleArray(shuffledValues);
    
    challenge.data.elements.forEach((element, index) => {
      const row = document.createElement('div');
      row.className = 'match-row';
      
      const elementSpan = document.createElement('span');
      elementSpan.textContent = element;
      elementSpan.className = 'match-element';
      
      const select = document.createElement('select');
      select.className = 'match-select';
      select.dataset.element = element;
      
      // Add blank option
      const blankOption = document.createElement('option');
      blankOption.value = '';
      blankOption.textContent = '-- Select --';
      select.appendChild(blankOption);
      
      // Add all values as options
      shuffledValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
      
      row.appendChild(elementSpan);
      row.appendChild(select);
      matchContainer.appendChild(row);
    });
    
    matchingDiv.appendChild(matchContainer);
    challengeInputArea.appendChild(matchingDiv);
    
    // Enable submit button
    challengeSubmitButton.disabled = false;
  }
  
  // Create code input
  function createCodeInput(challenge) {
    const codeDiv = document.createElement('div');
    codeDiv.className = 'code-challenge';
    
    // Add hints
    const hintsContainer = document.createElement('div');
    hintsContainer.className = 'hints-container';
    
    challenge.data.hints.forEach(hint => {
      const hintP = document.createElement('p');
      hintP.className = 'hint';
      hintP.textContent = '- ' + hint;
      hintsContainer.appendChild(hintP);
    });
    
    const label = document.createElement('label');
    label.textContent = 'Enter the 6-digit code:';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'challenge-input code-input';
    input.placeholder = '6-digit code';
    input.maxLength = 6;
    input.pattern = '[0-9]{6}';
    
    codeDiv.appendChild(hintsContainer);
    codeDiv.appendChild(label);
    codeDiv.appendChild(input);
    
    challengeInputArea.appendChild(codeDiv);
    
    // Enable submit button
    challengeSubmitButton.disabled = false;
  }
  
  // Check the user's answer for a challenge
  function checkChallengeAnswer(challenge) {
    let isCorrect = false;
    
    switch (challenge.type) {
      case 'pattern':
        isCorrect = checkPatternAnswer(challenge);
        break;
      case 'path':
        isCorrect = checkPathAnswer(challenge);
        break;
      case 'cipher':
        isCorrect = checkCipherAnswer(challenge);
        break;
      case 'matching':
        isCorrect = checkMatchingAnswer(challenge);
        break;
      case 'code':
        isCorrect = checkCodeAnswer(challenge);
        break;
    }
    
    if (isCorrect) {
      // Mark challenge as completed
      challenge.completed = true;
      gameState.challengesCompleted++;
      
      // Calculate XP based on completed challenges
      const newXP = Math.min(gameState.maxXP, Math.floor((gameState.challengesCompleted / challenges.length) * gameState.maxXP));
      gameState.xpEarned = newXP;
      updateXPDisplay();
      
      // Update root system visualization
      const progress = (gameState.challengesCompleted / challenges.length) * 100;
      rootSystem.updateProgress(progress);
      
      // Hide challenge container
      challengeContainer.classList.add('hidden');
      
      // Show success message in terminal
      terminal.print(`\nChallenge ${challenge.id + 1} completed! ${challenges.length - gameState.challengesCompleted} remaining.`, 'success');
      
      // Check if all challenges are completed
      if (gameState.challengesCompleted === challenges.length) {
        terminal.print('\nAll challenges completed! Type "root" to gain root access.', 'success');
      }
    } else {
      // Show error message in terminal
      terminal.print('\nIncorrect solution. Try again.', 'error');
    }
  }
  
  // Challenge-specific answer checkers
  function checkPatternAnswer(challenge) {
    const userPatternInputs = document.querySelectorAll('.pattern-buttons button[data-index]');
    const userPattern = Array.from(userPatternInputs).filter(btn => btn.classList.contains('selected')).map(btn => parseInt(btn.dataset.index));
    
    return JSON.stringify(userPattern) === JSON.stringify(challenge.data.correctPattern);
  }
  
  function checkPathAnswer(challenge) {
    const userPath = JSON.parse(challengeInputArea.dataset.userPath || '[]');
    
    // Check if user reached the end point
    const lastPoint = userPath[userPath.length - 1];
    return lastPoint && lastPoint.x === challenge.data.end.x && lastPoint.y === challenge.data.end.y;
  }
  
  function checkCipherAnswer(challenge) {
    const userAnswer = document.querySelector('.cipher-input').value.trim().toUpperCase();
    return userAnswer === challenge.data.solution;
  }
  
  function checkMatchingAnswer(challenge) {
    const selects = document.querySelectorAll('.match-select');
    let allCorrect = true;
    
    selects.forEach(select => {
      const element = select.dataset.element;
      const userValue = select.value;
      const correctValue = challenge.data.correctMatches[element];
      
      if (userValue !== correctValue) {
        allCorrect = false;
      }
    });
    
    return allCorrect;
  }
  
  function checkCodeAnswer(challenge) {
    const userCode = document.querySelector('.code-input').value.trim();
    return userCode === challenge.data.correctCode;
  }
  
  // Handle gaining root access
  document.addEventListener('rootAccess', function() {
    if (gameState.rootAccessGranted) return;
    
    gameState.rootAccessGranted = true;
    
    // Change terminal prompt
    terminal.setRootPrompt();
    
    // Update status display
    document.getElementById('access-level').textContent = 'GRANTED';
    document.getElementById('access-level').classList.add('granted');
    
    // Show rewards panel
    document.getElementById('rewards-panel').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
    
    // Play success animation
    rootSystem.showLevelUpEffect();
    rootSystem.showLevelUpEffect(); // Do it twice for emphasis
    
    // Terminal message
    terminal.print('\nROOT ACCESS GRANTED!', 'success');
    terminal.print('You now have full access to the Earth\'s root systems.', 'success');
    terminal.print('The Ground Baron will be pleased with your results.', 'success');
  });
  
  // Handle claiming rewards
  document.getElementById('claim-rewards').addEventListener('click', function() {
    // Update player state if it exists
    if (typeof playerState !== 'undefined') {
      // Save XP
      playerState.addXP('main', gameState.xpEarned);
      
      // Add Ground Me Me token if not already completed
      if (!gameState.alreadyCompleted) {
        const tokenAmount = 0.2;
        playerState.addMeMeToken('ground', tokenAmount);
        gameState.tokensEarned = tokenAmount;
      }
      
      // Mark as completed
      playerState.completeActivity('ground-root-hack');
      playerState.save();
      
      // Update UI feedback
      this.textContent = 'CLAIMED!';
      this.disabled = true;
    }
  });
  
  // Return to map
  document.getElementById('return-to-map').addEventListener('click', function() {
    window.location.href = '../../../ProgressMap/ProgressMapGM/index.html';
  });
  
  // Utility function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Initialize the game
  updateXPDisplay();
});