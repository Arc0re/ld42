class Player {
  constructor() {
    this.sprite = new Sprite(3, 26, BLOCK_WIDTH, BLOCK_HEIGHT);
    this.sprite.setPos({x: 20, y: 20});
    this.pixPerFrame = 50;
  }

  update(delta) {
    var p = this.pixPerFrame;
    if (keysDown[LEFT_KEY]) this.sprite.x = this.sprite.x-p*delta;
    if (keysDown[RIGHT_KEY]) this.sprite.x = this.sprite.x+p*delta;
    if (keysDown[UP_KEY]) this.sprite.y = this.sprite.y-p*delta;
    if (keysDown[DOWN_KEY]) this.sprite.y = this.sprite.y+p*delta;
  }

  render() {
    this.sprite.render();
  }
}
