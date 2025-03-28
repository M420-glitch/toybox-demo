window.playerState = {
  xp: parseInt(localStorage.getItem('playerXP')) || 0,

  getXP() {
    return this.xp;
  },

  setXP(val) {
    this.xp = val;
    localStorage.setItem('playerXP', val);
  },

  save() {
    localStorage.setItem('playerXP', this.xp);
  },

  load() {
    this.xp = parseInt(localStorage.getItem('playerXP')) || 0;
  }
};





