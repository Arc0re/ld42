const
  FPS_DIVIDER = 1000.0,
  SPRITESHEET_PATH = "gfx/spritesheet.png",
  CANVAS_SCALE = 4,
  CANVAS_WIDTH = 800,
  CANVAS_HEIGHT = 600,
  SOUND_MANAGER = new SoundManager([
    "snd/proj_blue_ball.wav",
    "snd/proj_green_ball.wav",
    "snd/powerup.wav",
    "snd/hit.wav",
    "snd/powerdown.wav",
    "snd/ouch.wav"
  ], onSoundManagerLoadingComplete),

  BLOCK_WIDTH = 8,
  BLOCK_HEIGHT = 8,
  SPACE_WIDTH = 120,
  SPACE_HEIGHT = 120,
  GAME_AREA_PIXEL_WIDTH = SPACE_WIDTH * BLOCK_WIDTH,
  GAME_AREA_PIXEL_HEIGHT = SPACE_HEIGHT * BLOCK_HEIGHT,
  GAME_AREA_PIXEL_WIDTH_SCALED = GAME_AREA_PIXEL_WIDTH * CANVAS_SCALE,
  GAME_AREA_PIXEL_HEIGHT_SCALED = GAME_AREA_PIXEL_HEIGHT * CANVAS_SCALE,

  SPACETILE_STAR0 = 1,
  SPACETILE_STAR1 = 2,
  SPACETILE_STAR2 = 3,

  GAMESTATE_MENU = 0,
  GAMESTATE_INGAME = 1,
  GAMESTATE_GAMEOVER = 2,
  GAMESTATE_NONE = 99,

  KEYBOARD_UP = 69,
  KEYBOARD_DOWN = 68,
  KEYBOARD_LEFT = 83,
  KEYBOARD_RIGHT = 70,
  KEYBOARD_SHOOTUP = 38,
  KEYBOARD_SHOOTDOWN = 40,
  KEYBOARD_SHOOTLEFT = 37,
  KEYBOARD_SHOOTRIGHT = 39,

  // Mapping starts from 0 cuz we don't wanna loop until 39 for nothing
  RIGHT_KEY = 0,
  LEFT_KEY = 1,
  UP_KEY = 2,
  DOWN_KEY = 3,
  SHOOT_RIGHT_KEY = 4,
  SHOOT_LEFT_KEY = 5,
  SHOOT_UP_KEY = 6,
  SHOOT_DOWN_KEY = 7,

  DEBUG_SHOW_COLLISION_BOXES = false;

var canvas = document.getElementById("game_canvas"),
  ctx = canvas.getContext("2d"),
  spriteSheet = new Image(),

  lastTime = null,
  windowWidth = 0, windowHeight = 0,
  currentState = GAMESTATE_NONE,
  keysDown = [],
  doneLoading = false,
  fontLoaded = false,
  soundsLoaded = false,

  sprite = new Sprite(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
  spaceMap = new Space(SPACE_WIDTH, SPACE_HEIGHT),
  player = new Player(),
  planets = new Planets(),
  monsters = new Monsters(),
  projectiles = new Projectiles();


// Entry point & Event listeneners
window.addEventListener('load', function () {
  init();
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
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  // Load assets etc
  spriteSheet.addEventListener('load', function () {
    console.log("Loaded " + SPRITESHEET_PATH);
    doneLoading = true;
  }, false);


  // Inputs
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  document.addEventListener('click', function (event) {
    if (!soundsLoaded) {
      SOUND_MANAGER.context.resume().then(() => {
        console.log("Resumed SOUND_MANAGER");
        SOUND_MANAGER.loadAllSounds();
      });
    }
  });

  // Font
  document.addEventListener(
    'png_font_loaded', function (e) {
      console.log("png_font loaded !");
      fontLoaded = true;
    }
  );

  spaceMap.init();
  player.sprite.setPos({x: GAME_AREA_PIXEL_WIDTH / 2, y: GAME_AREA_PIXEL_HEIGHT / 2});

  // Loading
  spriteSheet.src = SPRITESHEET_PATH;
  png_font.setup(
    ctx,
    "pngfont/unifont.png"
  );

  lastTime = Date.now();
  currentState = GAMESTATE_INGAME;
  tick();
}

function onSoundManagerLoadingComplete(list) {
  console.log("Sound loading complete!", list);
  soundsLoaded = true;
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
  switch (currentState) {
    case GAMESTATE_INGAME: {
      var pixPerSec = 50;
      var sp = sprite.getPos();
      if (sp.x * CANVAS_SCALE >= GAME_AREA_PIXEL_WIDTH_SCALED) sprite.x = 0;
      if (sp.y * CANVAS_SCALE >= GAME_AREA_PIXEL_HEIGHT_SCALED) sprite.y = 0;
      sprite.setPos({x: sprite.getPos().x + pixPerSec * delta, y: sprite.getPos().y + pixPerSec * delta});

      monsters.update(delta);
      planets.update(delta);
      player.update(delta);
      projectiles.update(delta);

      if (planets.getRemaining() <= 0) {
        currentState = GAMESTATE_GAMEOVER;
      }
    } break;

    case GAMESTATE_MENU: {
    } break;

    case GAMESTATE_GAMEOVER: {
    } break;
  }
}

function render() {
  if (!doneLoading) return;

  switch (currentState) {
    case GAMESTATE_INGAME:
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var px = player.sprite.x;//*CANVAS_SCALE;
      var py = player.sprite.y;//*CANVAS_SCALE;

      // Keep the player centered on the canvas
      ctx.translate(-(px - canvas.width * 0.5), -(py - canvas.height * 0.5));
      ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

      spaceMap.render();
      planets.render();
      monsters.render();
      sprite.render();
      player.render();
      projectiles.render();

      ctx.setTransform(1, 0, 0, 1, 0, 0); // faster??

      if (fontLoaded) {
        png_font.drawText("Planets remaining: " + planets.getRemaining(), [10, canvas.height - 40], "lightblue", 2, "blue");
        png_font.drawText("Score: " + player.scoreManager.getScore(), [canvas.width-200, canvas.height - 40], "lightblue", 2, "blue");
      }
      break;
    case GAMESTATE_GAMEOVER: {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (fontLoaded) {
        //png_font.drawText("Café",[160,40],'orange',4,'blue');
        png_font.drawText("GAME OVER",[CANVAS_WIDTH/2-140, CANVAS_HEIGHT/2-140],'red',8,'purple');
        png_font.drawText("Score: " + player.scoreManager.getScore(), [CANVAS_WIDTH/2-300, CANVAS_HEIGHT/2+140], 'darkblue', 3, 'blue');
      }
    } break;

    default:
      break;
  }
}

// Retarded
function keyDownHandler(event) {
  switch (event.keyCode) {
    case KEYBOARD_DOWN:
      keysDown[DOWN_KEY] = true;
      break;
    case KEYBOARD_UP:
      keysDown[UP_KEY] = true;
      break;
    case KEYBOARD_LEFT:
      keysDown[LEFT_KEY] = true;
      break;
    case KEYBOARD_RIGHT:
      keysDown[RIGHT_KEY] = true;
      break;
    case KEYBOARD_SHOOTDOWN:
      keysDown[SHOOT_DOWN_KEY] = true;
      break;
    case KEYBOARD_SHOOTUP:
      keysDown[SHOOT_UP_KEY] = true;
      break;
    case KEYBOARD_SHOOTLEFT:
      keysDown[SHOOT_LEFT_KEY] = true;
      break;
    case KEYBOARD_SHOOTRIGHT:
      keysDown[SHOOT_RIGHT_KEY] = true;
      break;
  }
}

function keyUpHandler(event) {
  switch (event.keyCode) {
    case KEYBOARD_DOWN:
      keysDown[DOWN_KEY] = false;
      break;
    case KEYBOARD_UP:
      keysDown[UP_KEY] = false;
      break;
    case KEYBOARD_LEFT:
      keysDown[LEFT_KEY] = false;
      break;
    case KEYBOARD_RIGHT:
      keysDown[RIGHT_KEY] = false;
      break;
    case KEYBOARD_SHOOTDOWN:
      keysDown[SHOOT_DOWN_KEY] = false;
      break;
    case KEYBOARD_SHOOTUP:
      keysDown[SHOOT_UP_KEY] = false;
      break;
    case KEYBOARD_SHOOTLEFT:
      keysDown[SHOOT_LEFT_KEY] = false;
      break;
    case KEYBOARD_SHOOTRIGHT:
      keysDown[SHOOT_RIGHT_KEY] = false;
      break;
  }
}
