const
  MON_BLUESNOWFLAKE = 0,
  MON_PURPLELOSANGE = 1,
  MON_GREENIE = 2;

const MONSTER_DATA = {
  [MON_BLUESNOWFLAKE]: { health: 50, attackPoints: 20, speed: 10, src: {x: 86, y: 4}, name: "alien_snowflake", animationFrames: 2, awardedPoints: 10 },
  [MON_PURPLELOSANGE]: { health: 70, attackPoints: 30, speed: 50, src: {x: 86, y: 13}, name: "alien_losange", animationFrames: 6, awardedPoints: 20 },
  [MON_GREENIE]: { health: 80, attackPoints: 10, speed: 10, src: {x: 86, y: 22}, name: "alien_insect", animationFrames: 3, awardedPoints: 30 },
};

class Monster {
  constructor(type, spawnPoint) {
    var d = MONSTER_DATA[type];
    this.type = type;
    this.sprite = new Sprite(d.src.x, d.src.y, BLOCK_WIDTH, BLOCK_HEIGHT, d.name);
    this.sprite.setupAnimationFrames(d.animationFrames);
    this.name = d.name;
    this.health = d.health;
    this.attackPoints = d.attackPoints;
    this.awardedPoints = d.awardedPoints;
    this.speed = d.speed;
    this.sprite.setPos({x: spawnPoint.x, y: spawnPoint.y});
    this.targetPlanet = null;
    this.targetData = null;
    this.isMoving = false;
    this.attackTimeout = 3000;
  }

  getRectangle() {
    return this.sprite.getRectangle();
  }

  update(delta) {
    if (this.targetPlanet === null || this.targetPlanet.health <= 0) {
      // Pick a planet to attack and go towards it until its dead
      var chosenOne = planets.getPlanet(Utils.randInt(0, planets.getRemaining()));
      if (chosenOne) {
        this.targetPlanet = chosenOne;

        // https://gamedev.stackexchange.com/questions/23447/moving-from-ax-y-to-bx1-y1-with-constant-speed
        var vecStart = new Utils.Vector(this.sprite.x, this.sprite.y);
        var vecDest = chosenOne.getTranslatedOrigin();
        var rnd = Utils.randInt(0, 1);
        vecDest = (rnd===0)?Utils.vector.add(vecDest, {x: -20, y: -10}):Utils.vector.add(vecDest, {x: chosenOne.width*Utils.randInt(2, 4), y:-30});
        var distance = Utils.vector.dist(vecStart, vecDest);
        var direction = Utils.vector.normalize(Utils.vector.sub(vecDest, vecStart));
        this.sprite.setPos(vecStart);
        this.targetData = new TargetData(vecStart, vecDest, direction, distance);
        this.isMoving = true;
      }
    } else {
      if (this.targetData && this.isMoving) {
        this.sprite.x += this.targetData.direction.x * this.speed * delta;
        this.sprite.y += this.targetData.direction.y * this.speed * delta;
        if (Utils.vector.dist(this.targetData.start, this.sprite.getPos()) >= this.targetData.distance) {
          this.sprite.setPos(this.targetData.end);
          this.isMoving = false;
          this.attack();
        }
      }
    }
    this.sprite.update(delta);
  }

  render() {
    this.sprite.render();
    if (DEBUG_SHOW_COLLISION_BOXES) {
      this.getRectangle().drawCollisionBox();
    }
  }

  attack() {
    if (this.targetPlanet && !this.targetPlanet.destroyed) {
      // Attack every x second until the planet is dead
      var self = this;
      var done = window.setInterval(function () {
        self.targetPlanet.health -= self.attackPoints;
      }, this.attackTimeout);
      if (done && this.targetPlanet.health <= 0) {
        window.clearInterval(done);
      }
    }
  }
}