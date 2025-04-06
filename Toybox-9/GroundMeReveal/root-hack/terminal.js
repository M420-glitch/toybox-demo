/* filepath: c:\Users\mites\Desktop\GVA-Toyboxes\Toybox-9\GroundMeReveal\root-hack\terminal.js */
/**
 * Terminal emulator for the Root Hack experience
 * Handles user input and simulates a hacking terminal
 */
const terminal = {
  container: null,
  output: null,
  prompt: null,
  input: null,
  history: [],
  historyIndex: -1,
  commandHandlers: {},
  initialized: false,
  
  init: function() {
    this.container = document.getElementById('terminal');
    this.output = document.getElementById('terminal-output');
    this.prompt = document.querySelector('.prompt');
    this.input = document.getElementById('terminal-input');
    
    if (!this.container || !this.output || !this.prompt || !this.input) {
      console.error('Terminal elements not found in the DOM');
      return;
    }
    
    // Register command handlers
    this.commandHandlers = {
      'help': this.helpCommand.bind(this),
      'clear': this.clearCommand.bind(this),
      'ls': this.lsCommand.bind(this),
      'cd': this.cdCommand.bind(this),
      'challenge': this.challengeCommand.bind(this),
      'root': this.rootCommand.bind(this),
      'exit': this.exitCommand.bind(this)
    };
    
    // Set up event listeners
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Welcome message
    this.addSystemOutput(`GAIA_ROOT_ACCESS_v2.25`);
    this.addSystemOutput(`INITIALIZING ROOT ACCESS PROTOCOL...`);
    setTimeout(() => this.addSystemOutput(`CONNECTING TO MYCELIAL NETWORK...`), 500);
    setTimeout(() => this.addOutput(`⚠️ UNAUTHORIZED ACCESS DETECTED`, 'warning-msg'), 1000);
    setTimeout(() => this.addSystemOutput(`DEPLOYING ANTI-INTRUSION COUNTERMEASURES...`), 1500);
    setTimeout(() => this.addSystemOutput(`COMPLETE ROOT ACCESS CHALLENGES TO BYPASS SECURITY`), 2000);
    setTimeout(() => {
      this.addSystemOutput(`.`);
      setTimeout(() => this.addSystemOutput(`..`), 300);
      setTimeout(() => this.addSystemOutput(`...`), 600);
      setTimeout(() => {
        this.addOutput(`BARON PROTOCOL OVERRIDE ENGAGED`, 'success-msg');
        this.addSystemOutput(`WELCOME TO ROOTKIT v9.13.7`);
        this.addSystemOutput(`TYPE <span class="cmd">help</span> TO BEGIN`);
        this.printPrompt();
      }, 900);
    }, 2500);
    
    this.initialized = true;
  },
  
  handleKeyDown: function(e) {
    if (e.key === 'Enter') {
      const cmd = this.input.value.trim();
      if (cmd) {
        this.executeCommand(cmd);
        this.input.value = '';
        
        // Add to history
        this.history.push(cmd);
        this.historyIndex = this.history.length;
      }
    } 
    else if (e.key === 'ArrowUp') {
      // Navigate history up
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
        
        // Move cursor to end
        setTimeout(() => {
          this.input.selectionStart = this.input.value.length;
          this.input.selectionEnd = this.input.value.length;
        }, 0);
      }
      e.preventDefault();
    } 
    else if (e.key === 'ArrowDown') {
      // Navigate history down
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else if (this.historyIndex === this.history.length - 1) {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
      e.preventDefault();
    }
    else if (e.key === 'Tab') {
      // Simple tab completion
      const partialCmd = this.input.value.trim();
      if (partialCmd) {
        const matches = Object.keys(this.commandHandlers).filter(cmd => 
          cmd.startsWith(partialCmd)
        );
        
        if (matches.length === 1) {
          this.input.value = matches[0];
        } 
        else if (matches.length > 0) {
          this.addOutput(`\nPossible commands:`);
          matches.forEach(cmd => this.addOutput(`  ${cmd}`));
          this.printPrompt();
        }
      }
      e.preventDefault();
    }
  },
  
  executeCommand: function(cmd) {
    // Show the command in the terminal
    this.addOutput(`${this.prompt.textContent} ${cmd}`);
    
    // Parse command and arguments
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Execute command if it exists
    if (this.commandHandlers[command]) {
      this.commandHandlers[command](args);
    } else {
      this.addOutput(`Command not found: ${command}. Type <span class="cmd">help</span> for available commands.`, 'error-msg');
    }
  },
  
  addOutput: function(text, className = '') {
    const line = document.createElement('div');
    line.className = className;
    line.innerHTML = text;
    this.output.appendChild(line);
    
    // Scroll to bottom
    this.output.scrollTop = this.output.scrollHeight;
    
    return line;
  },
  
  addSystemOutput: function(text) {
    return this.addOutput(text, 'system-msg');
  },
  
  printPrompt: function() {
    this.addOutput(`${this.prompt.textContent} `, 'input-line');
  },
  
  clearOutput: function() {
    while (this.output.firstChild) {
      this.output.removeChild(this.output.firstChild);
    }
  },
  
  // Command handlers
  helpCommand: function() {
    this.addOutput(`\nAvailable commands:`);
    this.addOutput(`  <span class="cmd">help</span> - Show this help message`);
    this.addOutput(`  <span class="cmd">clear</span> - Clear the terminal`);
    this.addOutput(`  <span class="cmd">ls</span> - List files in current directory`);
    this.addOutput(`  <span class="cmd">cd [dir]</span> - Change directory`);
    this.addOutput(`  <span class="cmd">challenge [id]</span> - List or start a challenge`);
    this.addOutput(`  <span class="cmd">root</span> - Attempt to gain root access`);
    this.addOutput(`  <span class="cmd">exit</span> - Exit the terminal`);
  },
  
  clearCommand: function() {
    this.clearOutput();
  },
  
  lsCommand: function() {
    this.addOutput(`\nDirectory listing:`);
    this.addOutput(`drwxr-xr-x  2 root root 4096 Apr 6 2025 <span class="cmd">challenges</span>`);
    this.addOutput(`-rwxr-xr-x  1 root root 2048 Apr 6 2025 access_codes.bin`);
    this.addOutput(`-rwxr-xr-x  1 root root 3072 Apr 5 2025 mycelial_network.dat`);
    this.addOutput(`drwxr-xr-x  2 root root 4096 Apr 4 2025 <span class="cmd">root_system</span>`);
    this.addOutput(`-rwxr-xr-x  1 root root 1024 Apr 3 2025 baron_manifest.sig`);
  },
  
  cdCommand: function(args) {
    if (!args || !args.length) {
      this.addOutput(`Usage: cd [directory]`, 'error-msg');
      return;
    }
    
    const dir = args[0];
    
    if (dir === 'challenges') {
      this.prompt.textContent = 'root@gaia:/challenges$';
      this.addOutput(`Changed directory to /challenges`);
    } 
    else if (dir === 'root_system') {
      this.prompt.textContent = 'root@gaia:/root_system$';
      this.addOutput(`Changed directory to /root_system`);
    }
    else if (dir === '..') {
      this.prompt.textContent = 'root@gaia:~$';
      this.addOutput(`Changed directory to /home/root`);
    }
    else {
      this.addOutput(`cd: ${dir}: No such directory`, 'error-msg');
    }
  },
  
  challengeCommand: function(args) {
    if (!args || !args.length) {
      this.addOutput(`\nAvailable challenges:`);
      app.challenges.forEach((challenge, index) => {
        const status = app.state.rootNodesUnlocked.includes(challenge.id) 
          ? '✓ [COMPLETED]' 
          : '○ [AVAILABLE]';
        this.addOutput(`  ${index + 1}. ${challenge.title} ${status}`);
      });
      this.addOutput(`\nType <span class="cmd">challenge [id]</span> to start a challenge.`);
      return;
    }
    
    // Try to get challenge by number or id
    let challenge;
    if (!isNaN(parseInt(args[0]))) {
      const index = parseInt(args[0]) - 1;
      if (index >= 0 && index < app.challenges.length) {
        challenge = app.challenges[index];
      }
    } else {
      challenge = app.getChallengeById(args[0]);
    }
    
    if (!challenge) {
      this.addOutput(`Challenge not found. Type <span class="cmd">challenge</span> to list all challenges.`, 'error-msg');
      return;
    }
    
    this.addOutput(`\nInitiating challenge: ${challenge.title}`);
    this.addSystemOutput(`Loading challenge interface...`);
    
    // Start the challenge
    setTimeout(() => app.startChallenge(challenge.id), 500);
  },
  
  rootCommand: function() {
    if (app.state.challengesCompleted >= app.state.totalChallenges) {
      this.addOutput(`\nAttempting to gain root access...`, 'system-msg');
      
      setTimeout(() => {
        this.addOutput(`ROOT ACCESS GRANTED!`, 'success-msg');
        app.showRewards();
      }, 1000);
    } else {
      this.addOutput(`\nROOT ACCESS DENIED`, 'error-msg');
      this.addOutput(`Complete all ${app.state.totalChallenges} challenges to gain root access.`, 'warning-msg');
      this.addOutput(`Current progress: ${app.state.challengesCompleted}/${app.state.totalChallenges} challenges completed.`);
    }
  },
  
  exitCommand: function() {
    this.addOutput(`\nNice try! There is no escape from the root.`, 'warning-msg');
  },
  
  // UI effects
  toggleMinimize: function() {
    this.addSystemOutput(`Cannot minimize terminal during active hack session.`);
  },
  
  toggleMaximize: function() {
    this.addSystemOutput(`Terminal already at optimal size for hacking operations.`);
  },
  
  shake: function() {
    const terminalElement = document.getElementById('terminal');
    terminalElement.classList.add('shake');
    
    // Remove the class after animation completes
    setTimeout(() => {
      terminalElement.classList.remove('shake');
    }, 500);
  }
};