const FPS_DIVIDER = 1000.0,
  SPRITESHEET_PATH = "gfx/spritesheet.png",
  BLOCK_WIDTH = 8,
  BLOCK_HEIGHT = 8,
  CANVAS_SCALE = 4,
  SPACE_WIDTH = 200,
  SPACE_HEIGHT = 200,
  SPACETILE_STAR0 = 1,
  SPACETILE_STAR1 = 2,
  SPACETILE_STAR2 = 3;

var canvas = document.getElementById("game_canvas"),
  ctx = canvas.getContext("2d"),
  lastTime = null,
  spriteSheet = new Image(),
  doneLoading = false,
  windowWidth = 0, windowHeight = 0;

// Type definitions

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

class Space {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = [];
  }

  init() {
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var tileNum = randInt(1, 4);
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
          currentTile.render();
        }
      }
    }
  }
}

var sprite = new Sprite(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
var space = new Space(SPACE_WIDTH, SPACE_HEIGHT);

// Entry point
window.addEventListener('load', function () {
  init();
}, false);

// Load assets etc
spriteSheet.addEventListener('load', function () {
  console.log("Loaded " + SPRITESHEET_PATH);
  doneLoading = true;
}, false);

function init() {
  // https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
  windowWidth = x;
  windowHeight = y;

  // TODO: https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da ??
  // canvas.style.width = windowWidth + "px";
  // canvas.style.height = windowHeight + "px";

  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

  // Initialisation
  space.init();
  console.log(space);

  // Loading
  spriteSheet.src = SPRITESHEET_PATH;

  lastTime = Date.now();
  tick();
}

function tick() {
  var now = Date.now();
  var delta = (now - lastTime) / FPS_DIVIDER;

  update(delta);
  render();

  lastTime = now;
  requestAnimationFrame(tick);
}

function update(delta) {
  sprite.setPos({x: 20, y: 20});
}

function render() {
  if (doneLoading) {
    space.render();
    sprite.render();
  }
}

// Utils
function randInt(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}