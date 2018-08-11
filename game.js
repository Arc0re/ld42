const
  FPS_DIVIDER = 1000.0,
  SPRITESHEET_PATH = "gfx/spritesheet.png",
  CANVAS_SCALE = 4,

  BLOCK_WIDTH = 8,
  BLOCK_HEIGHT = 8,
  SPACE_WIDTH = 50,
  SPACE_HEIGHT = 50,

  SPACETILE_STAR0 = 1,
  SPACETILE_STAR1 = 2,
  SPACETILE_STAR2 = 3,

  GAMESTATE_MENU = 0,
  GAMESTATE_INGAME = 1,
  GAMESTATE_NONE = 99,

  KEYBOARD_RIGHT = 39,
  KEYBOARD_LEFT = 37,
  KEYBOARD_UP = 38,
  KEYBOARD_DOWN = 40,

  // Mapping starts from 0 cuz we don't wanna loop until 39 for nothing
  RIGHT_KEY = 0,
  LEFT_KEY = 1,
  UP_KEY = 2,
  DOWN_KEY = 3;

var canvas = document.getElementById("game_canvas"),
  ctx = canvas.getContext("2d"),
  lastTime = null,
  spriteSheet = new Image(),
  doneLoading = false,
  windowWidth = 0, windowHeight = 0,
  currentState = GAMESTATE_NONE,
  keysDown = [];

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

var sprite = new Sprite(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
var space = new Space(SPACE_WIDTH, SPACE_HEIGHT);
var player = new Player();


// Entry point & Event listeneners
window.addEventListener('load', function () {
  init();
}, false);

// Load assets etc
spriteSheet.addEventListener('load', function () {
  console.log("Loaded " + SPRITESHEET_PATH);
  doneLoading = true;
}, false);

// Inputs
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


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

  // Loading
  spriteSheet.src = SPRITESHEET_PATH;

  lastTime = Date.now();
  currentState = GAMESTATE_INGAME;
  tick();
}

// ENGINE FUNCS

function tick() {
  var now = Date.now();
  var delta = (now - lastTime) / FPS_DIVIDER;

  update(delta);
  render();

  lastTime = now;
  requestAnimationFrame(tick);
}

function update(delta) {
  var pixPerSec = 50;
  var sp = sprite.getPos();
  if (sp.x*CANVAS_SCALE >= canvas.width) sprite.x = 0;
  if (sp.y*CANVAS_SCALE >= canvas.height) sprite.y = 0;
  sprite.setPos({x: sprite.getPos().x+pixPerSec*delta, y: sprite.getPos().y+pixPerSec*delta});

  player.update(delta);
}

var cameraMoved = false;
function render() {
  if (doneLoading && currentState === GAMESTATE_INGAME) {
    if (!cameraMoved) {
      space.render();
      cameraMoved = false;
    }
    sprite.render();
    player.render();
  }
}

// Retarded
function keyDownHandler(event) {
  switch (event.keyCode) {
    case KEYBOARD_DOWN: keysDown[DOWN_KEY] = true; break;
    case KEYBOARD_UP: keysDown[UP_KEY] = true; break;
    case KEYBOARD_LEFT: keysDown[LEFT_KEY] = true; break;
    case KEYBOARD_RIGHT: keysDown[RIGHT_KEY] = true; break;
  }
}
function keyUpHandler(event) {
  switch (event.keyCode) {
    case KEYBOARD_DOWN: keysDown[DOWN_KEY] = false; break;
    case KEYBOARD_UP: keysDown[UP_KEY] = false; break;
    case KEYBOARD_LEFT: keysDown[LEFT_KEY] = false; break;
    case KEYBOARD_RIGHT: keysDown[RIGHT_KEY] = false; break;
  }
}


// Utils
function randInt(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}