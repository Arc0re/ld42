const FPS_DIVIDER = 1000.0,
  SPRITESHEET_PATH = "gfx/spritesheet.png",
  BLOCK_WIDTH = 8,
  BLOCK_HEIGHT = 8,
  CANVAS_SCALE = 4;

var canvas = document.getElementById("game_canvas");
ctx = canvas.getContext("2d"),
  lastTime = null,
  spriteSheet = new Image(),
  doneLoading = false,
  windowWidth = 0, windowHeight = 0;

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
  // console.log("tick: " + delta);
}

function render() {
  if (doneLoading) {
    ctx.drawImage(spriteSheet, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 10, 10, BLOCK_WIDTH, BLOCK_HEIGHT);
  }
}