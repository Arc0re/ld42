class Player {
  constructor() {
    this.sprite = new Sprite(3, 26, BLOCK_WIDTH, BLOCK_HEIGHT, "player_sprite");
    this.sprite.setPos({x: 0, y: 0});
    this.pixPerFrame = 250;
    this.projectileType = PROJ_BLUEBALL;
  }

  update(delta) {
    var p = this.pixPerFrame;
    if (keysDown[LEFT_KEY]) this.sprite.x -= p*delta;
    if (keysDown[RIGHT_KEY]) this.sprite.x += p*delta;
    if (keysDown[UP_KEY]) this.sprite.y -= p*delta;
    if (keysDown[DOWN_KEY]) this.sprite.y += p*delta;
  }

  attack(targetVec) {
    var normalize = (vec) => {
      var x = vec.x * CANVAS_SCALE;
      var y = vec.y * CANVAS_SCALE;
      return new Utils.Vector(x, y);
    };
    var projectile = new Projectile(this.projectileType);
    projectile.fire(this.sprite.getPos(), normalize(targetVec));
    console.log("Fired ", projectile);
  }

  render() {
    this.sprite.render();
  }
}
