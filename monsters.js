const MAX_MONSTERS = 50;

class Monsters {
  constructor() {
    this.monsters = [];

    for (var m=0; m<MAX_MONSTERS; m++){
      var x = Utils.randInt(0, canvas.width-BLOCK_WIDTH);
      var y = Utils.randInt(0, canvas.height-BLOCK_HEIGHT);
      var hp = Utils.randInt(10, 50);
      var att = Utils.randInt(5, 20);

      this.monsters.push(new Monster("Monster #" + m, {x: x, y: y}, hp, att));
    }
  }

  update(delta) {
    for (var m=0; m<MAX_MONSTERS; m++){
      var mon = this.monsters[m];
      if (mon) mon.update(delta);
    }
  }

  render() {
    for (var m = 0; m < MAX_MONSTERS; m++) {
      var mon = this.monsters[m];
      if (mon) mon.render();
    }
  }
}