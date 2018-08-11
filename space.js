class Space {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = [];
  }

  getTileAt(x, y) {
    return this.map[x+y*this.width];
  }

  init() {
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var tileNum = Utils.randInt(1, 10);
        var newSprite = null;
        switch (tileNum) {
          case SPACETILE_STAR0:
            newSprite = new Sprite(8, 13, BLOCK_WIDTH, BLOCK_HEIGHT, "star_block_0");
            break;
          case SPACETILE_STAR1:
            newSprite = new Sprite(17, 13, BLOCK_WIDTH, BLOCK_HEIGHT, "star_block_1");
            break;
          default:
          case SPACETILE_STAR2:
            newSprite = new Sprite(26, 13, BLOCK_WIDTH, BLOCK_HEIGHT, "star_block_2");
            break;
        }
        this.map[x + y * this.width] = newSprite;
      }
    }
  }

  render() {
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var currentTile = this.map[x + y * this.width];
        if (currentTile) {
          currentTile.setPos({x: x * currentTile.width, y: y * currentTile.height});
          //currentTile.render();
          ctx.drawImage(spriteSheet, currentTile.srcX, currentTile.srcY, currentTile.width, currentTile.height, currentTile.x, currentTile.y, currentTile.width, currentTile.height);
        }
      }
    }
  }
}