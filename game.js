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
    "snd/ouch.wav",
    "snd/hit_player.wav",
    "snd/proj_redbeam2.wav",
    "snd/explosion.wav",
    "snd/pause.wav",
    "snd/start.wav",
    "snd/proj_bigball.wav",
    "snd/proj_star.wav"
  ], onSoundManagerLoadingComplete),

  BLOCK_WIDTH = 8,
  BLOCK_HEIGHT = 8,
  SPACE_WIDTH = 100,
  SPACE_HEIGHT = 100,
  GAME_AREA_PIXEL_WIDTH = SPACE_WIDTH * BLOCK_WIDTH,
  GAME_AREA_PIXEL_HEIGHT = SPACE_HEIGHT * BLOCK_HEIGHT,
  GAME_AREA_PIXEL_WIDTH_SCALED = GAME_AREA_PIXEL_WIDTH * CANVAS_SCALE,
  GAME_AREA_PIXEL_HEIGHT_SCALED = GAME_AREA_PIXEL_HEIGHT * CANVAS_SCALE,

  SPACETILE_STAR0 = 1,
  SPACETILE_STAR1 = 2,
  SPACETILE_STAR2 = 3,

  GAMESTATE_TITLESCREEN = 0,
  GAMESTATE_INGAME = 1,
  GAMESTATE_GAMEOVER = 2,
  GAMESTATE_VICTORY = 3,
  GAMESTATE_PAUSE = 4,
  GAMESTATE_NONE = 99,

  KEYBOARD_UP = 'KeyW',
  KEYBOARD_DOWN = 'KeyS',
  KEYBOARD_LEFT = 'KeyA',
  KEYBOARD_RIGHT = 'KeyD',
  KEYBOARD_SHOOTUP = 'ArrowUp',
  KEYBOARD_SHOOTDOWN = 'ArrowDown',
  KEYBOARD_SHOOTLEFT = 'ArrowLeft',
  KEYBOARD_SHOOTRIGHT = 'ArrowRight',
  KEYBOARD_ENTER = 'Enter',
  KEYBOARD_SHIFTLEFT = 'ShiftLeft',

  // Mapping starts from 0 cuz we don't wanna loop until 39 for nothing
  RIGHT_KEY = 0,
  LEFT_KEY = 1,
  UP_KEY = 2,
  DOWN_KEY = 3,
  SHOOT_RIGHT_KEY = 4,
  SHOOT_LEFT_KEY = 5,
  SHOOT_UP_KEY = 6,
  SHOOT_DOWN_KEY = 7,
  ENTER_KEY = 8,
  SHIFT_LEFT = 9,

  DEBUG_SHOW_COLLISION_BOXES = false;

var canvas = document.getElementById("game_canvas"),
  ctx = canvas.getContext("2d"),
  spriteSheet = new Image(),

  lastTime = null,
  windowWidth = 0, windowHeight = 0,
  currentState = GAMESTATE_NONE,
  startingState = GAMESTATE_TITLESCREEN,
  keysDown = [],
  doneLoading = false,
  fontLoaded = false,
  soundsLoaded = false,
  highScore = 0,
  alienKilledCount = 0,

  sprite = new Sprite(9, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
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
  currentState = startingState;
  tick();
}

function restart() {
  highScore = 0;
  alienKilledCount = 0;
  sprite = new Sprite(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
  spaceMap = new Space(SPACE_WIDTH, SPACE_HEIGHT);
  player = new Player();
  planets = new Planets();
  monsters = new Monsters();
  projectiles = new Projectiles();
  spaceMap.init();
  player.sprite.setPos({x: GAME_AREA_PIXEL_WIDTH / 2, y: GAME_AREA_PIXEL_HEIGHT / 2});
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
    case GAMESTATE_TITLESCREEN: {
      if (keysDown[ENTER_KEY]) {
        keysDown[ENTER_KEY] = false;
        currentState = GAMESTATE_INGAME;
        SOUND_MANAGER.play("start");
      }
    } break;

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
      if (player.dead) {
        currentState = GAMESTATE_GAMEOVER;
      }
      if (monsters.getRemaining() <= 0 && planets.getRemaining() > 0) {
        currentState = GAMESTATE_VICTORY;
      }

      if (keysDown[ENTER_KEY]) {
        keysDown[ENTER_KEY] = false;
        currentState = GAMESTATE_PAUSE;
        SOUND_MANAGER.play("pause");
      }
      if (keysDown[SHIFT_LEFT]) {
        player.pixPerFrame = Player.HELD_SPEED;
      } else if (!keysDown[SHIFT_LEFT]) {
        player.pixPerFrame = Player.NORMAL_SPEED;
      }
    } break;

    case GAMESTATE_PAUSE: {
      if (keysDown[ENTER_KEY]) {
        keysDown[ENTER_KEY] = false;
        currentState = GAMESTATE_INGAME;
      }
    } break;

    case GAMESTATE_GAMEOVER:
    case GAMESTATE_VICTORY: {
      if (keysDown[ENTER_KEY]) {
        currentState = GAMESTATE_INGAME;
        restart();
      }
    } break;
  }
}

function render() {
  if (!doneLoading) return;

  switch (currentState) {
    case GAMESTATE_TITLESCREEN: {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (fontLoaded) {
        png_font.drawText("METAL SHIP SOLID",[280, 20],'purple',2,'darkblue');
        png_font.drawText("SPACE EATER",[CANVAS_WIDTH/2-160, 30],'darkblue',8,'blue');
        Utils.blink(800, function () {
          png_font.drawText("PRESS ENTER TO BEGIN",[160, CANVAS_HEIGHT/2],'white',3,'blue');
        });

        png_font.drawText("The Galaxy needs you!", [CANVAS_WIDTH/2-160, CANVAS_HEIGHT/2+60], "red", 2,"blue");
        png_font.drawText("Destroy all the aliens, save the planets!", [70, CANVAS_HEIGHT/2+90], "red", 2,"blue");

        png_font.drawText("[ WASD   ]: Move Ship", [110, CANVAS_HEIGHT/2+140-4], 'grey', 2, 'blue');
        png_font.drawText("[ Arrows ]: Fire", [110, CANVAS_HEIGHT/2+170-4], 'grey', 2, 'blue');
        png_font.drawText("[ Enter  ]: Pause", [110, CANVAS_HEIGHT/2+200-4], 'grey', 2, 'blue');
        png_font.drawText("[ Shift  ]: Precision Mode", [110, CANVAS_HEIGHT/2+230-4], 'grey', 2, 'blue');

        png_font.drawText("2018 - LD42Compo - github.com/Arc0re", [110, CANVAS_HEIGHT-40], 'darkgrey', 2, 'blue');
      }
    } break;

    case GAMESTATE_INGAME: {
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
        png_font.drawText("Aliens: " + monsters.getRemaining(), [CANVAS_WIDTH - 200, 0], "lightblue", 2, "blue");
        png_font.drawText("Planets remaining: " + planets.getRemaining(), [10, canvas.height - 40], "lightblue", 2, "blue");
        png_font.drawText(player.scoreManager.getScore().toString(), [5, 0], "lightblue", 2, "blue");
        png_font.drawText(player.health.toString() + " HP", [5, 30], "red", 2, "blue");
        png_font.drawText("HIGH SCORE", [(canvas.width / 2) - 90, 0], "red", 2, "darkred");
        png_font.drawText(highScore.toString(), [(canvas.width / 2) - 30, 30], "white", 2, "black");
        if (!soundsLoaded) {
          Utils.blink(500, function () {
            png_font.drawText("**CLICK FOR SOUND**", [canvas.width / 2 + 50, canvas.height - 40], "white", 2, "black");
          });
        }
      }
    } break;

    case GAMESTATE_PAUSE: {
      png_font.drawText("PAUSED", [CANVAS_WIDTH/2-60, CANVAS_HEIGHT/2-40], 'orange', 3, 'blue');
    } break;

    case GAMESTATE_GAMEOVER: {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (fontLoaded) {
        png_font.drawText("GAME OVER",[CANVAS_WIDTH/2-140, CANVAS_HEIGHT/2-300],'red',8,'purple');
        displayHighScoreEtc();
      }
    } break;

    case GAMESTATE_VICTORY: {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (fontLoaded) {
        png_font.drawText("VICTORY",[CANVAS_WIDTH/2-120,40],'orange',4,'blue');
        png_font.drawText("The Galaxy is now at peace...",[CANVAS_WIDTH/2-220,150],'white',2,'blue');
        png_font.drawText("But for how long...?",[CANVAS_WIDTH/2-150,200],'white',2,'blue');
        displayHighScoreEtc();
      }
    } break;

    default:
      break;
  }
}

function displayHighScoreEtc() {
  Utils.blink(500, function () {
    png_font.drawText("PRESS ENTER TO RESTART", [CANVAS_WIDTH/2-270, CANVAS_HEIGHT/2-40], 'orange', 3, 'blue');
  });
  png_font.drawText("*HIGH SCORE*", [CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2+20], 'red', 3, 'purple');
  png_font.drawText(highScore.toString(), [CANVAS_WIDTH/2-30, CANVAS_HEIGHT/2+70], 'white', 2, 'black');
  png_font.drawText("Final Score: " + player.scoreManager.getScore(), [CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2+140], 'lightblue', 2, 'blue');
  png_font.drawText("Saved Worlds: " + planets.getRemaining(), [CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2+180], 'lightblue', 2, 'blue');
  png_font.drawText("Exterminated Aliens: " + alienKilledCount, [CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2+220], 'lightblue', 2, 'blue');
};

// Retarded
function keyDownHandler(event) {
  switch (event.code) {
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
    case KEYBOARD_ENTER:
      keysDown[ENTER_KEY] = true;
      break;
    case KEYBOARD_SHIFTLEFT:
      keysDown[SHIFT_LEFT] = true;
      break;
  }
}

function keyUpHandler(event) {
  switch (event.code) {
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
    case KEYBOARD_ENTER:
      keysDown[ENTER_KEY] = false;
      break;
    case KEYBOARD_SHIFTLEFT:
      keysDown[SHIFT_LEFT] = false;
      break;
  }
}
