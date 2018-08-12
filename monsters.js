const MAX_MONSTERS = 50;

class Monsters {
  constructor() {
    this.monsters = [];

    for (var m=0; m<MAX_MONSTERS; m++){
      var x = Utils.randInt(0, canvas.width-BLOCK_WIDTH);
      var y = Utils.randInt(0, canvas.height-BLOCK_HEIGHT);
      var type = Utils.randInt(MON_BLUESNOWFLAKE, MON_GREENIE);
      this.monsters.push(new Monster(type, {x: x, y: y}));
    }
  }

  get() {
    return this.monsters;
  }

  getMonster(index) {
    return this.monsters[index];
  }

  getRemaining() {
    return this.monsters.length;
  }

  update(delta) {
    var m = this.getRemaining();
    if (m<=0) return;
    while (m--) {
      var alien = this.monsters[m];
      if (alien) {
        alien.update(delta);
        if (alien.health<=0) {
          this.monsters.splice(m, 1);
        }
      }
    }
  }

  render() {
    for (var m = 0; m < MAX_MONSTERS; m++) {
      var mon = this.monsters[m];
      if (mon) {
        mon.render();
      }
    }
  }
}