class Player {
  constructor() {
    this.sprite = new Sprite(3, 26, BLOCK_WIDTH, BLOCK_HEIGHT, "player_sprite");
    this.sprite.setPos({x: 0, y: 0});
    this.pixPerFrame = 250;
  }

  update(delta) {
    var p = this.pixPerFrame;
    if (keysDown[LEFT_KEY]) this.sprite.x -= p*delta;
    if (keysDown[RIGHT_KEY]) this.sprite.x += p*delta;
    if (keysDown[UP_KEY]) this.sprite.y -= p*delta;
    if (keysDown[DOWN_KEY]) this.sprite.y += p*delta;
  }

  render() {
    this.sprite.render();
  }
}
