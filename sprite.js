class Sprite {
  constructor(srcX, srcY, width, height, name) {
    this.srcX = srcX;
    this.srcY = srcY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.x = 0;
    this.y = 0;
  }

  setPos(vec) {
    this.x = vec.x;
    this.y = vec.y;
  }

  getPos() {
    return {x: this.x, y: this.y};
  }

  render() {
    ctx.drawImage(spriteSheet, this.srcX, this.srcY, this.width, this.height, this.x, this.y, this.width, this.height);
  }
}
