/* filepath: c:\Users\mites\Desktop\GVA-Toyboxes\Toybox-9\GroundMeReveal\root-hack\root-system.js */
/**
 * Root System Visualization
 * Creates a visual representation of the root system that grows as challenges are completed
 */
class RootSystem {
  constructor() {
    this.svg = document.getElementById('root-svg');
    this.progress = 0; // 0 to 100 percent
    this.roots = [];
    this.maxRoots = 20;
    this.levels = [20, 40, 60, 80, 100]; // Progress levels for each challenge
    this.currentLevel = 0;
    
    // Initialize the system
    this.init();
  }
  
  init() {
    // Create the soil line
    const soilLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    soilLine.setAttribute('x1', '0');
    soilLine.setAttribute('y1', '50');
    soilLine.setAttribute('x2', '300');
    soilLine.setAttribute('y2', '50');
    soilLine.setAttribute('stroke', '#3E2723');
    soilLine.setAttribute('stroke-width', '2');
    this.svg.appendChild(soilLine);
    
    // Create the seed/starting point
    const seed = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    seed.setAttribute('cx', '150');
    seed.setAttribute('cy', '50');
    seed.setAttribute('r', '5');
    seed.setAttribute('fill', '#4CAF50');
    this.svg.appendChild(seed);
    
    // Add a little glow to the seed
    const seedGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    seedGlow.setAttribute('cx', '150');
    seedGlow.setAttribute('cy', '50');
    seedGlow.setAttribute('r', '8');
    seedGlow.setAttribute('fill', 'none');
    seedGlow.setAttribute('stroke', '#4CAF50');
    seedGlow.setAttribute('stroke-width', '1');
    seedGlow.setAttribute('opacity', '0.5');
    this.svg.appendChild(seedGlow);
    
    // Create initial roots at 0% progress
    this.updateProgress(0);
  }
  
  // Generate a random root path
  generateRootPath(startX, startY, length, angle, complexity) {
    let path = `M ${startX} ${startY}`;
    let currentX = startX;
    let currentY = startY;
    let currentAngle = angle;
    
    // Add segments to create a natural-looking curve
    const segments = Math.floor(3 + Math.random() * 5);
    for (let i = 0; i < segments; i++) {
      const segmentLength = length / segments;
      currentAngle += (Math.random() - 0.5) * complexity;
      
      const endX = currentX + Math.sin(currentAngle) * segmentLength;
      const endY = currentY + Math.cos(currentAngle) * segmentLength;
      
      const controlX1 = currentX + Math.sin(currentAngle - 0.2) * segmentLength * 0.6;
      const controlY1 = currentY + Math.cos(currentAngle - 0.1) * segmentLength * 0.6;
      
      path += ` C ${controlX1} ${controlY1}, ${endX-10} ${endY-10}, ${endX} ${endY}`;
      
      currentX = endX;
      currentY = endY;
    }
    
    return path;
  }
  
  // Create a new root
  createRoot(progress) {
    const rootDepth = progress * 3; // Deeper roots with more progress
    const startX = 150 + (Math.random() - 0.5) * 20;
    const startY = 50;
    
    const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.8; // Mostly downward
    const length = 30 + rootDepth + Math.random() * 40;
    const complexity = 0.8 + (progress / 100) * 1.2; // More complex with progress
    
    const rootPath = this.generateRootPath(startX, startY, length, angle, complexity);
    
    const root = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    root.setAttribute('d', rootPath);
    root.setAttribute('fill', 'none');
    root.setAttribute('stroke', '#4CAF50');
    root.setAttribute('stroke-width', '1.5');
    root.setAttribute('opacity', '0');
    
    // Add root to SVG
    this.svg.appendChild(root);
    this.roots.push(root);
    
    // Animate root growing
    setTimeout(() => {
      root.setAttribute('opacity', '0.8');
      const length = root.getTotalLength();
      root.style.strokeDasharray = length;
      root.style.strokeDashoffset = length;
      root.style.transition = 'stroke-dashoffset 2s ease-in-out';
      setTimeout(() => {
        root.style.strokeDashoffset = '0';
      }, 100);
    }, 100);
    
    // Maybe add some small branches to existing roots
    if (progress > 20 && Math.random() > 0.5) {
      this.addBranchesToRoot(root, complexity);
    }
  }
  
  // Add branches to an existing root
  addBranchesToRoot(root, complexity) {
    // Get some points along the main root to branch from
    const length = root.getTotalLength();
    const numBranches = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numBranches; i++) {
      const pointOnRoot = root.getPointAtLength(length * (0.3 + Math.random() * 0.6));
      const startX = pointOnRoot.x;
      const startY = pointOnRoot.y;
      
      // Calculate angle perpendicular to the root at this point
      const before = root.getPointAtLength(Math.max(0, length * (0.3 + Math.random() * 0.6) - 5));
      const angle = Math.atan2(pointOnRoot.y - before.y, pointOnRoot.x - before.x) + Math.PI/2;
      
      const branchLength = 10 + Math.random() * 20;
      const branchPath = this.generateRootPath(startX, startY, branchLength, angle + (Math.random() - 0.5), complexity * 1.5);
      
      const branch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      branch.setAttribute('d', branchPath);
      branch.setAttribute('fill', 'none');
      branch.setAttribute('stroke', '#4CAF50');
      branch.setAttribute('stroke-width', '1');
      branch.setAttribute('opacity', '0');
      
      this.svg.appendChild(branch);
      
      // Animate branch growing
      setTimeout(() => {
        branch.setAttribute('opacity', '0.7');
        const branchTotalLength = branch.getTotalLength();
        branch.style.strokeDasharray = branchTotalLength;
        branch.style.strokeDashoffset = branchTotalLength;
        branch.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        setTimeout(() => {
          branch.style.strokeDashoffset = '0';
        }, 100);
      }, 1000 + Math.random() * 1000);
    }
  }
  
  // Update the root system based on progress
  updateProgress(progress) {
    this.progress = progress;
    
    // Determine how many roots to display based on progress
    const targetRoots = Math.floor((this.maxRoots * progress) / 100);
    
    // Add new roots if needed
    while (this.roots.length < targetRoots) {
      this.createRoot(progress);
    }
    
    // Check if we've reached a new level
    if (progress >= this.levels[this.currentLevel] && this.currentLevel < this.levels.length) {
      this.showLevelUpEffect();
      this.currentLevel++;
    }
  }
  
  // Show a visual effect when reaching a new level
  showLevelUpEffect() {
    const flash = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    flash.setAttribute('x', '0');
    flash.setAttribute('y', '0');
    flash.setAttribute('width', '300');
    flash.setAttribute('height', '400');
    flash.setAttribute('fill', '#4CAF50');
    flash.setAttribute('opacity', '0.2');
    this.svg.appendChild(flash);
    
    // Animate the flash
    let opacity = 0.2;
    const fadeInterval = setInterval(() => {
      opacity -= 0.01;
      flash.setAttribute('opacity', opacity.toString());
      if (opacity <= 0) {
        clearInterval(fadeInterval);
        this.svg.removeChild(flash);
      }
    }, 50);
    
    // Also add a pulse to the seed
    const seedGlow = this.svg.querySelector('circle:nth-of-type(2)');
    let glowSize = 8;
    const glowInterval = setInterval(() => {
      glowSize += 0.5;
      seedGlow.setAttribute('r', glowSize.toString());
      seedGlow.setAttribute('opacity', (1 - (glowSize - 8) / 20).toString());
      if (glowSize >= 28) {
        clearInterval(glowInterval);
        seedGlow.setAttribute('r', '8');
        seedGlow.setAttribute('opacity', '0.5');
      }
    }, 50);
  }
}