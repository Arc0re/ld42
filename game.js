const
  FPS_DIVIDER = 1000.0,
  SPRITESHEET_PATH = "gfx/spritesheet.png",
  CANVAS_SCALE = 4,

  BLOCK_WIDTH = 8,
  BLOCK_HEIGHT = 8,
  SPACE_WIDTH = 100,
  SPACE_HEIGHT = 100,
  GAME_AREA_PIXEL_WIDTH = SPACE_WIDTH*BLOCK_WIDTH,
  GAME_AREA_PIXEL_HEIGHT = SPACE_HEIGHT*BLOCK_HEIGHT,
  GAME_AREA_PIXEL_WIDTH_SCALED = GAME_AREA_PIXEL_WIDTH*CANVAS_SCALE,
  GAME_AREA_PIXEL_HEIGHT_SCALED = GAME_AREA_PIXEL_HEIGHT*CANVAS_SCALE,

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
  spriteSheet = new Image(),

  lastTime = null,
  windowWidth = 0, windowHeight = 0,
  currentState = GAMESTATE_NONE,
  keysDown = [],
  doneLoading = false,

  sprite = new Sprite(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
  spaceMap = new Space(SPACE_WIDTH, SPACE_HEIGHT),
  player = new Player();


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

  //ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

  // Initialisation
  spaceMap.init();
  // player.sprite.setPos({
  //     x: ((canvas.width/2)-player.sprite.width/2)/CANVAS_SCALE,
  //     y: ((canvas.height/2)-player.sprite.height/2)/CANVAS_SCALE
  //   });
  player.sprite.setPos({x: GAME_AREA_PIXEL_WIDTH/2, y: GAME_AREA_PIXEL_HEIGHT/2});

  // Loading
  spriteSheet.src = SPRITESHEET_PATH;

  lastTime = Date.now();
  currentState = GAMESTATE_INGAME;
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
  var pixPerSec = 50;
  var sp = sprite.getPos();
  if (sp.x*CANVAS_SCALE >= GAME_AREA_PIXEL_WIDTH_SCALED) sprite.x = 0;
  if (sp.y*CANVAS_SCALE >= GAME_AREA_PIXEL_HEIGHT_SCALED) sprite.y = 0;
  sprite.setPos({x: sprite.getPos().x+pixPerSec*delta, y: sprite.getPos().y+pixPerSec*delta});

  player.update(delta);
}

function render() {
  if (!doneLoading) return;

  switch (currentState) {
    case GAMESTATE_INGAME:
      //ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var px = player.sprite.x;//*CANVAS_SCALE;
      var py = player.sprite.y;//*CANVAS_SCALE;

      console.log(px, py);

      // Keep the player centered on the canvas
      //ctx.translate(-(px - canvas.width / 2), -(py - canvas.height / 2));
      // ctx.translate(-px, -py);
      // ctx.translate(canvas.width/2, canvas.height/2);
      ctx.translate(-(px - canvas.width * 0.5), -(py - canvas.height * 0.5));
      ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

      spaceMap.render();
      sprite.render();
      player.render();

      //ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      break;

    default:
      break;
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
