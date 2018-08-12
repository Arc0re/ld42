class Sprite {
  constructor(srcX, srcY, width, height, name) {
    this.srcX = srcX;
    this.srcY = srcY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.animated = false;
    this.animationFrames = 0;
    this.currentFrame = 0;
    this.startingSrcX = srcX;
    this.timesFrame = [];
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

  setupAnimationFrames(numFrames) {
    this.animated = true;
    this.animationFrames = numFrames;
    for (var i=0; i<numFrames; i++) {
      this.timesFrame[i] = 1;
    }
  }

  update(delta) {
    const TIME_BETWEEN_FRAMES = 10;
    if (this.animated && this.animationFrames>0) {
      this.currentFrame++;
      this.timesFrame[this.currentFrame]++;
      if (this.currentFrame>=this.animationFrames) {
        this.currentFrame = 0;
        this.srcX = this.startingSrcX;
      }
      if (this.timesFrame[this.currentFrame]>TIME_BETWEEN_FRAMES) {
        this.srcX += (this.currentFrame*this.width+1);
        this.timesFrame[this.currentFrame] = 1;
      }
    }
  }

  render() {
    ctx.drawImage(spriteSheet, this.srcX, this.srcY, this.width, this.height, this.x/CANVAS_SCALE, this.y/CANVAS_SCALE, this.width, this.height);
  }
}
