// Root System Visualization
const rootSystem = {
  svg: null,
  nodeElements: {},
  connectionElements: {},
  rootElements: [],
  initialized: false,
  
  init: function() {
    this.svg = document.getElementById('root-svg');
    if (!this.svg) {
      console.error('Root system SVG element not found');
      return;
    }
    
    // Clear any existing elements
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
    
    // Create soil line
    const soilLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    soilLine.setAttribute('d', 'M 10,60 C 40,50 100,65 150,55 S 250,70 290,60');
    soilLine.setAttribute('stroke', '#8D6E63');
    soilLine.setAttribute('stroke-width', '3');
    soilLine.setAttribute('fill', 'none');
    this.svg.appendChild(soilLine);
    
    // Create the central node
    this.createCentralNode();
    
    // Create the challenge nodes
    this.createNodes();
    
    this.initialized = true;
  },
  
  createCentralNode: function() {
    const centralNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centralNode.setAttribute('cx', '150');
    centralNode.setAttribute('cy', '60');
    centralNode.setAttribute('r', '8');
    centralNode.setAttribute('fill', '#4CAF50');
    centralNode.setAttribute('stroke', '#2E7D32');
    centralNode.setAttribute('stroke-width', '2');
    centralNode.setAttribute('id', 'central-node');
    this.svg.appendChild(centralNode);
    
    // Add glow effect
    const centralGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centralGlow.setAttribute('cx', '150');
    centralGlow.setAttribute('cy', '60');
    centralGlow.setAttribute('r', '12');
    centralGlow.setAttribute('fill', 'none');
    centralGlow.setAttribute('stroke', '#4CAF50');
    centralGlow.setAttribute('stroke-width', '2');
    centralGlow.setAttribute('opacity', '0.3');
    centralGlow.setAttribute('id', 'central-glow');
    this.svg.appendChild(centralGlow);
    
    // Pulsating animation for the glow
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animate.setAttribute('attributeName', 'r');
    animate.setAttribute('values', '12;18;12');
    animate.setAttribute('dur', '3s');
    animate.setAttribute('repeatCount', 'indefinite');
    centralGlow.appendChild(animate);
    
    const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateOpacity.setAttribute('attributeName', 'opacity');
    animateOpacity.setAttribute('values', '0.3;0.6;0.3');
    animateOpacity.setAttribute('dur', '3s');
    animateOpacity.setAttribute('repeatCount', 'indefinite');
    centralGlow.appendChild(animateOpacity);
  },
  
  createNodes: function() {
    // Define node positions
    const nodePositions = {
      'node1': { x: 50, y: 120 },
      'node2': { x: 100, y: 180 },
      'node3': { x: 200, y: 180 },
      'node4': { x: 250, y: 120 },
      'node5': { x: 150, y: 220 },
    };
    
    // Create nodes
    Object.entries(nodePositions).forEach(([nodeId, pos]) => {
      // Create connection to central node first (starts invisible)
      const connection = this.createConnection('150,60', `${pos.x},${pos.y}`, nodeId);
      this.connectionElements[nodeId] = connection;
      
      // Create the node
      const node = this.createNode(pos.x, pos.y, nodeId);
      this.nodeElements[nodeId] = node;
    });
  },
  
  createNode: function(x, y, id) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', id);
    group.setAttribute('class', 'node locked');
    
    // Node circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', '#333');
    circle.setAttribute('stroke', '#4CAF50');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('class', 'node-circle');
    group.appendChild(circle);
    
    // Node label (number)
    const nodeNumber = id.replace('node', '');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '12');
    text.textContent = nodeNumber;
    group.appendChild(text);
    
    // Add a subtle glow effect
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.setAttribute('cx', x);
    glow.setAttribute('cy', y);
    glow.setAttribute('r', '15');
    glow.setAttribute('fill', 'none');
    glow.setAttribute('stroke', '#333');
    glow.setAttribute('stroke-width', '1');
    glow.setAttribute('opacity', '0.3');
    glow.setAttribute('class', 'node-glow');
    group.appendChild(glow);
    
    this.svg.appendChild(group);
    return group;
  },
  
  createConnection: function(fromCoords, toCoords, id) {
    // Create a connection path (initially invisible)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Create a curved path
    const [fromX, fromY] = fromCoords.split(',').map(Number);
    const [toX, toY] = toCoords.split(',').map(Number);
    
    // Control point for curve
    const cpX = (fromX + toX) / 2;
    const cpY = (fromY + toY) / 2 + ((toY - fromY) / 4); // Add a bit of curve
    
    const d = `M ${fromX},${fromY} Q ${cpX},${cpY} ${toX},${toY}`;
    
    path.setAttribute('d', d);
    path.setAttribute('stroke', '#4CAF50');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('id', `connection-${id}`);
    path.setAttribute('opacity', '0');
    path.setAttribute('stroke-dasharray', path.getTotalLength());
    path.setAttribute('stroke-dashoffset', path.getTotalLength());
    
    this.svg.appendChild(path);
    
    // Add small roots along the path
    this.addRootDecoration(fromX, fromY, toX, toY, cpX, cpY);
    
    return path;
  },
  
  addRootDecoration: function(fromX, fromY, toX, toY, cpX, cpY) {
    // Add small branching roots along the path for decoration
    const numRoots = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numRoots; i++) {
      // Find a point along the curve
      const t = (i + 1) / (numRoots + 1);
      const pointX = Math.pow(1-t, 2) * fromX + 2 * (1-t) * t * cpX + Math.pow(t, 2) * toX;
      const pointY = Math.pow(1-t, 2) * fromY + 2 * (1-t) * t * cpY + Math.pow(t, 2) * toY;
      
      // Create a small decoration root
      const rootLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Calculate angle perpendicular to the path at this point
      const tangentX = -2 * (1-t) * fromX + 2 * (1-2*t) * cpX + 2 * t * toX;
      const tangentY = -2 * (1-t) * fromY + 2 * (1-2*t) * cpY + 2 * t * toY;
      const angle = Math.atan2(tangentY, tangentX) + Math.PI/2;
      
      // Create a small branching root
      const length = 5 + Math.random() * 10;
      const endX = pointX + Math.cos(angle) * length;
      const endY = pointY + Math.sin(angle) * length;
      
      // Add a small curve to the root
      const ctrlX = pointX + Math.cos(angle) * (length/2) + (Math.random() - 0.5) * 5;
      const ctrlY = pointY + Math.sin(angle) * (length/2) + (Math.random() - 0.5) * 5;
      
      rootLine.setAttribute('d', `M ${pointX},${pointY} Q ${ctrlX},${ctrlY} ${endX},${endY}`);
      rootLine.setAttribute('stroke', '#4CAF50');
      rootLine.setAttribute('stroke-width', '1');
      rootLine.setAttribute('fill', 'none');
      rootLine.setAttribute('opacity', '0');
      rootLine.setAttribute('class', 'root-decoration');
      
      this.svg.appendChild(rootLine);
      this.rootElements.push(rootLine);
    }
  },
  
  activateNode: function(nodeId) {
    const node = this.nodeElements[nodeId];
    if (node) {
      // Highlight the node
      node.classList.add('active');
      node.querySelector('.node-circle').setAttribute('stroke', '#FFC107');
      node.querySelector('.node-circle').setAttribute('stroke-width', '3');
      node.querySelector('.node-glow').setAttribute('stroke', '#FFC107');
      node.querySelector('.node-glow').setAttribute('opacity', '0.6');
      
      // Add a pulsating animation
      const circle = node.querySelector('.node-circle');
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'r');
      animate.setAttribute('values', '10;12;10');
      animate.setAttribute('dur', '1.5s');
      animate.setAttribute('repeatCount', 'indefinite');
      circle.appendChild(animate);
    }
  },
  
  unlockNode: function(nodeId) {
    const node = this.nodeElements[nodeId];
    if (node) {
      // Remove "active" class if it exists
      node.classList.remove('active');
      // Remove "locked" class
      node.classList.remove('locked');
      // Add "unlocked" class
      node.classList.add('unlocked');
      
      // Update appearance
      const circle = node.querySelector('.node-circle');
      circle.setAttribute('fill', '#4CAF50');
      circle.setAttribute('stroke', '#2E7D32');
      circle.setAttribute('stroke-width', '2');
      
      // Remove any animations
      while (circle.firstChild) {
        circle.removeChild(circle.firstChild);
      }
      
      // Update glow
      const glow = node.querySelector('.node-glow');
      glow.setAttribute('stroke', '#4CAF50');
      glow.setAttribute('opacity', '0.4');
      
      // Animate the connection to become visible
      const connection = this.connectionElements[nodeId];
      if (connection) {
        connection.setAttribute('opacity', '1');
        connection.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        connection.style.strokeDashoffset = '0';
        
        // Also show the decoration roots with a delay
        this.rootElements.forEach((root, index) => {
          setTimeout(() => {
            root.setAttribute('opacity', '0.8');
          }, 1000 + Math.random() * 500);
        });
      }
    }
  },
  
  unlockAllNodes: function() {
    Object.keys(this.nodeElements).forEach(nodeId => {
      this.unlockNode(nodeId);
    });
  },
  
  celebrate: function() {
    // Create celebration effects
    const centralNode = document.getElementById('central-node');
    const centralGlow = document.getElementById('central-glow');
    
    // Make the central node pulse
    centralNode.setAttribute('r', '10');
    
    // Make the glow more intense
    centralGlow.setAttribute('opacity', '0.8');
    centralGlow.setAttribute('stroke-width', '3');
    centralGlow.setAttribute('r', '20');
    
    // Create radiating circles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const radiatingCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        radiatingCircle.setAttribute('cx', '150');
        radiatingCircle.setAttribute('cy', '60');
        radiatingCircle.setAttribute('r', '15');
        radiatingCircle.setAttribute('fill', 'none');
        radiatingCircle.setAttribute('stroke', '#4CAF50');
        radiatingCircle.setAttribute('stroke-width', '2');
        radiatingCircle.setAttribute('opacity', '0.8');
        this.svg.appendChild(radiatingCircle);
        
        // Animate the radiating circle
        let radius = 15;
        let opacity = 0.8;
        const interval = setInterval(() => {
          radius += 3;
          opacity -= 0.02;
          radiatingCircle.setAttribute('r', radius.toString());
          radiatingCircle.setAttribute('opacity', opacity.toString());
          
          if (opacity <= 0) {
            clearInterval(interval);
            this.svg.removeChild(radiatingCircle);
          }
        }, 50);
      }, i * 1000);
    }
    
    // Make all nodes pulse
    Object.values(this.nodeElements).forEach(node => {
      const circle = node.querySelector('.node-circle');
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'r');
      animate.setAttribute('values', '10;13;10');
      animate.setAttribute('dur', '1s');
      animate.setAttribute('repeatCount', '3');
      circle.appendChild(animate);
    });
  }
};