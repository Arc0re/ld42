class PlanetBlock {
  constructor(colour) {
    this.colour = colour;
    this.sprite = null;

    //TODO: rnd planet parts for same colour
    switch (colour) {
      case "blue":
        this.sprite = new Sprite(44, 5, BLOCK_WIDTH, BLOCK_HEIGHT, "planet_blue_block0");
        break;
      case "red":
        this.sprite = new Sprite(44, 14, BLOCK_WIDTH, BLOCK_HEIGHT, "planet_red_block0");
        break;
      case "sand":
        this.sprite = new Sprite(44, 23, BLOCK_WIDTH, BLOCK_HEIGHT, "planet_sand_block0");
        break;
      case "ice":
        this.sprite = new Sprite(44, 32, BLOCK_WIDTH, BLOCK_HEIGHT, "planet_ice_block0");
        break;
    }
  }
}

class Planet {
  constructor(name, origin, colour, planetData) {
    this.blocks = planetData.blocks;
    this.sprites = [];
    this.width = planetData.width;
    this.height = planetData.height;
    this.origin = origin;
    this.name = name;
    this.colour = colour;
    this.health = planetData.health;
  }

  getTranslatedOrigin() {
    return {x: this.origin.x*CANVAS_SCALE, y: this.origin.y*CANVAS_SCALE};
  }

  init() {
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var blockSprite = null;
        switch (this.blocks[x+y*this.width]){
          case "x": blockSprite = new PlanetBlock(this.colour);
        }
        this.sprites[x+y*this.width] = blockSprite;
      }
    }
    console.log("Created planet " + this.name + " at {x: " + this.origin.x + ", y: " + this.origin.y + "}");
  }

  render() {
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if (this.sprites[x + y * this.width]) {
          var currentTile = this.sprites[x + y * this.width].sprite;
          if (currentTile) {
            currentTile.setPos({x: (this.origin.x*CANVAS_SCALE) + x * currentTile.width, y: (this.origin.y*CANVAS_SCALE) + y * currentTile.height});
            currentTile.render();
          }
        }
      }
    }
  }
}