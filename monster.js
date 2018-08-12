class Monster {
  constructor(name, spawnPoint, health, attack) {
    var rnd = Utils.randInt(0, 5);
    switch (rnd) {
      case 0:
      default:
        this.sprite = new Sprite(86, 4, BLOCK_WIDTH, BLOCK_HEIGHT, name);
        break;
    }
    this.name = name;
    this.spawnPoint = spawnPoint;
    this.health = health;
    this.attackPoints = attack;
    this.sprite.setPos({x: spawnPoint.x, y: spawnPoint.y});
    this.targetPlanet = null;
    this.targetData = null;
    this.speed = Utils.randInt(5, 20);
    this.isMoving = false;
    this.attackTimeout = 3000;
  }

  getRectangle() {
    return new Rectangle(Math.floor(this.sprite.x), Math.floor(this.sprite.y), this.sprite.width, this.sprite.height);
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
  }

  render() {
    this.sprite.render();
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