const
  PROJ_BLUEBALL = 0,
  PROJ_GREENBALL = 1,
  PROJ_NULL = -1

PROJECTILE_LIFESPAN = 2000;

const PROJECTILES = {
  [PROJ_BLUEBALL]: {src: {x: 54, y: 54}, size: 2, damage: 10, speed: 200, name: "proj_blue_ball"},
  [PROJ_GREENBALL]: {src: {x: 54, y: 57}, size: 2, damage: 20, speed: 300, name: "proj_green_ball"}
};

class Projectile {
  constructor(type) {
    this.sprite = Sprite.makeProjectileSprite(PROJECTILES[type]);
    this.isMoving = false;
    this.targetData = null;
    this.arrived = false;
    this.markedForDeletion = false;
    this.timeBeforeDeletion = null;
    this.speed = PROJECTILES[type].speed;
    this.type = type;
  }

  getRectangle() {
    return new Rectangle(Math.floor(this.sprite.x), Math.floor(this.sprite.y), this.sprite.width, this.sprite.height);
  }

  fire(vecStart, vecDest) {
    console.log(vecStart, vecDest);
    var distance = Utils.vector.dist(vecStart, vecDest);
    var direction = Utils.vector.normalize(Utils.vector.sub(vecDest, vecStart));
    this.sprite.setPos(vecStart);
    this.isMoving = true;
    this.targetData = new TargetData(vecStart, vecDest, direction, distance);
    var self = this;
    this.timeBeforeDeletion = window.setTimeout(function () {
      self.markedForDeletion = true;
    }, PROJECTILE_LIFESPAN);

    projectiles.add(this);
  }

  update(delta) {
    if (this.targetData && this.isMoving) {
      this.sprite.x += this.targetData.direction.x * this.speed * delta;
      this.sprite.y += this.targetData.direction.y * this.speed * delta;

      // "Collisions"
      for (var p=0;p<planets.getRemaining(); p++) {
        var planet = planets.getPlanet(p);
        if (planet){
          if (this.getRectangle().intersects(planet.getRectangle())){
            //console.log("Hit planet " + planet.name + " for " + PROJECTILES[this.type].damage + "dmg.");
            planet.health -= PROJECTILES[this.type].damage;
            this.markedForDeletion = true;
          }
        }
      }

      if (this.arrived) this.markedForDeletion = true;
      if (Utils.vector.dist(this.targetData.start, this.sprite.getPos()) >= this.targetData.distance) {
        this.sprite.setPos(this.targetData.end);
        this.isMoving = false;
        this.arrived = true;
      }
    }
  }

  render() {
    this.sprite.render();
  }
}