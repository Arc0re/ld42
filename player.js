class ScoreManager {
  constructor(playerInstance) {
    this.playerRef = playerInstance;
    this.score = 0;
  }

  rewardForKilling(alien) {
    this.score += alien.awardedPoints;
  }
}

class Player {
  constructor() {
    this.sprite = new Sprite(3, 26, BLOCK_WIDTH, BLOCK_HEIGHT, "player_sprite");
    this.sprite.setPos({x: 0, y: 0});
    this.pixPerFrame = 250;
    this.projectileType = PROJ_BLUEBALL;
    this.scoreManager = new ScoreManager(this);
  }

  update(delta) {
    var p = this.pixPerFrame;
    if (keysDown[LEFT_KEY]) this.sprite.x -= p*delta;
    if (keysDown[RIGHT_KEY]) this.sprite.x += p*delta;
    if (keysDown[UP_KEY]) this.sprite.y -= p*delta;
    if (keysDown[DOWN_KEY]) this.sprite.y += p*delta;
    if (keysDown[SHOOT_LEFT_KEY]) this.attack({x: -this.sprite.x, y: this.sprite.y});
    if (keysDown[SHOOT_RIGHT_KEY]) this.attack({x: this.sprite.x*10, y: this.sprite.y});
    if (keysDown[SHOOT_UP_KEY]) this.attack({x: this.sprite.x, y: -this.sprite.y});
    if (keysDown[SHOOT_DOWN_KEY]) this.attack({x: this.sprite.x, y: this.sprite.y*10});
  }

  attack(targetVec) {
    var projectile = new Projectile(this.projectileType);
    projectile.fire({x: this.sprite.x+((this.sprite.width/2)-projectile.sprite.width/2)*CANVAS_SCALE, y: this.sprite.y+((this.sprite.height/2)-projectile.sprite.height/2)*CANVAS_SCALE}, targetVec);
  }

  render() {
    this.sprite.render();
  }
}
