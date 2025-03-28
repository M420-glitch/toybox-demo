window.playerState = {
  xp: parseInt(localStorage.getItem('playerXP')) || 50,

  getXP() {
    return this.xp;
  },

  setXP(val) {
    this.xp = val;
    localStorage.setItem('playerXP', val);
  }
};
