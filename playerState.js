window.playerState = {
  xp: parseInt(localStorage.getItem('playerXP')) || 0,
  completed: JSON.parse(localStorage.getItem('completedToyboxes')) || [],
  meMes: JSON.parse(localStorage.getItem('meMes')) || {},

  getXP() {
    return this.xp;
  },

  setXP(val) {
    this.xp = val;
    localStorage.setItem('playerXP', val);
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
    this.meMes[token] = true;
    localStorage.setItem('meMes', JSON.stringify(this.meMes));
  },

  hasMeMe(token) {
    return this.meMes[token] === true;
  },

  save() {
    localStorage.setItem('playerXP', this.xp);
    localStorage.setItem('completedToyboxes', JSON.stringify(this.completed));
    localStorage.setItem('meMes', JSON.stringify(this.meMes));
  },

  load() {
    this.xp = parseInt(localStorage.getItem('playerXP')) || 0;
    this.completed = JSON.parse(localStorage.getItem('completedToyboxes')) || [];
    this.meMes = JSON.parse(localStorage.getItem('meMes')) || {};
  }
};
