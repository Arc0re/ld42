class ScoreManager {
  constructor(playerInstance) {
    this.playerRef = playerInstance;
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  rewardForKilling(alien) {
    this.score += alien.awardedPoints;
    highScore += alien.awardedPoints;
    alienKilledCount++;
    this.applyPowerup();
    SOUND_MANAGER.play("hit");
  }

  malus(amount) {
    this.score -= amount;
    if (this.score<=0) this.score = 0;
    this.applyPowerup();
    SOUND_MANAGER.play("ouch");
  }

  applyPowerup() {
    var minScoreForWeapon = (PROJECTILE_DATA[this.playerRef.projectileType-1])?PROJECTILE_DATA[this.playerRef.projectileType-1].scoreToPowerup:0;
    if (this.score >= PROJECTILE_DATA[this.playerRef.projectileType].scoreToPowerup && typeof PROJECTILE_DATA[this.playerRef.projectileType+1] !== 'undefined') {
      SOUND_MANAGER.play("powerup");
      this.playerRef.projectileType++;
    } else if (minScoreForWeapon === 0) {
      this.playerRef.projectileType = PROJ_BLUEBALL;
    } else if (this.score < minScoreForWeapon) {
      this.playerRef.projectileType--;
      SOUND_MANAGER.play("powerdown");
    }
  }
}

class Player {
  constructor() {
    this.sprite = new Sprite(3, 26, BLOCK_WIDTH, BLOCK_HEIGHT, "player_sprite");
    this.sprite.setPos({x: 0, y: 0});
    this.pixPerFrame = 250;
    this.projectileType = PROJ_BLUEBALL;
    this.attackCoolDown = PROJECTILE_DATA[this.projectileType].coolDownMs;
    this.scoreManager = new ScoreManager(this);
    this.lastAttackTime = 0;
    this.health = 500;
    this.dead = false;
  }

  getRectangle() {
    return this.sprite.getRectangle();
  }

  update(delta) {
    if (this.health <= 0) {
      this.dead = true;
      return;
    }

    var p = this.pixPerFrame;
    if (keysDown[LEFT_KEY]) this.sprite.x -= p*delta;
    if (keysDown[RIGHT_KEY]) this.sprite.x += p*delta;
    if (keysDown[UP_KEY]) this.sprite.y -= p*delta;
    if (keysDown[DOWN_KEY]) this.sprite.y += p*delta;
    if (keysDown[SHOOT_LEFT_KEY]) this.attack({x: -this.sprite.x, y: this.sprite.y});
    if (keysDown[SHOOT_RIGHT_KEY]) this.attack({x: this.sprite.x*10, y: this.sprite.y});
    if (keysDown[SHOOT_UP_KEY]) this.attack({x: this.sprite.x, y: -this.sprite.y});
    if (keysDown[SHOOT_DOWN_KEY]) this.attack({x: this.sprite.x, y: this.sprite.y*10});

    // Collisions
    for (var m=0; m<monsters.getRemaining(); m++) {
      var alien = monsters.getMonster(m);
      if (alien) {
        if (this.getRectangle().intersects(alien.getRectangle())) {
          this.health -= alien.attackPoints;
          SOUND_MANAGER.play("hit_player");
          let rndX = Utils.randInt(-20, 20);
          let rndY = Utils.randInt(-20, 20);
          this.sprite.setPos(Utils.vector.add(this.sprite.getPos(), {x: rndX, y: rndY}));
        }
      }
    }
  }

  attack(targetVec) {
    var now = Date.now();
    if (now - this.lastAttackTime < PROJECTILE_DATA[this.projectileType].coolDownMs) return;
    this.lastAttackTime = now;

    SOUND_MANAGER.play(PROJECTILE_DATA[this.projectileType].name);

    var projectile = new Projectile(this.projectileType);
    projectile.fire({x: this.sprite.x+((this.sprite.width/2)-projectile.sprite.width/2)*CANVAS_SCALE, y: this.sprite.y+((this.sprite.height/2)-projectile.sprite.height/2)*CANVAS_SCALE}, targetVec);
  }

  render() {
    this.sprite.render();
  }
}
