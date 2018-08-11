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

  static makeProjectileSprite(projectileData) {
    return new Sprite(projectileData.src.x, projectileData.src.y, projectileData.size, projectileData.size, projectileData.name);
  }

  setPos(vec) {
    this.x = vec.x;
    this.y = vec.y;
  }

  getPos() {
    return {x: this.x, y: this.y};
  }

  render() {
    ctx.drawImage(spriteSheet, this.srcX, this.srcY, this.width, this.height, this.x/CANVAS_SCALE, this.y/CANVAS_SCALE, this.width, this.height);
  }
}
