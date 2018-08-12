const SMALL_PLANET_DATA = {
  blocks: [
    ".", ".", ".", ".", "x", "x", ".", ".", ".", ".",
    ".", ".", "x", "x", "x", "x", "x", "x", ".", ".",
    ".", "x", "x", "x", "x", "x", "x", "x", "x", ".",
    ".", "x", "x", "x", "x", "x", "x", "x", "x", ".",
    "x", "x", "x", "x", "x", "x", "x", "x", "x", "x",
    "x", "x", "x", "x", "x", "x", "x", "x", "x", "x",
    ".", "x", "x", "x", "x", "x", "x", "x", "x", ".",
    ".", "x", "x", "x", "x", "x", "x", "x", "x", ".",
    ".", ".", "x", "x", "x", "x", "x", "x", ".", ".",
    ".", ".", ".", ".", "x", "x", ".", ".", ".", ".",
  ],
  width: 10,
  height: 10,
  health: 400,
  malusForFriendlyFire: 15
};

const MEDIUM_PLANET_DATA = {
  blocks: [
    ".", ".", ".", ".", ".", ".", "x", "x", "x", "x", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", "x", "x", "x", "x", "x", "x", "x", "x", ".", ".", ".", ".",
    ".", ".", ".", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ".", ".", ".",
    ".", ".", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ".", ".",
    ".", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ".",
    ".", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ".",
    "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x",
    "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x",
    "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x",
    "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x",
    ".", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ".",
    ".", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ".",
    ".", ".", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ".", ".",
    ".", ".", ".", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ".", ".", ".",
    ".", ".", ".", ".", "x", "x", "x", "x", "x", "x", "x", "x", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", "x", "x", "x", "x", ".", ".", ".", ".", ".", ".",
  ],
  width: 16,
  height: 16,
  health: 800,
  malusForFriendlyFire: 25
};

const MAX_PLANET_PIXEL_SIZE = 16*8;
const COLOURS = ["red", "sand", "blue", "ice"];

class Planets {
  constructor() {
    this.planets = [];
    var genNum = Utils.randInt(10, 20);

    for (var i=0; i<genNum; i++) {
      var planetData = (Utils.randInt(0, 1) === 0) ? SMALL_PLANET_DATA : MEDIUM_PLANET_DATA;
      var colour = COLOURS[Math.floor(Math.random()*COLOURS.length)];
      this.planets.push(
        new Planet("planet_"+i,
        {
          x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE),
          y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)
        },
        colour,
        planetData));
      this.planets[this.planets.length-1].init();
    }
  }

  getRemaining() {
    return this.planets.length;
  }

  getPlanet(index) {
    return this.planets[index];
  }

  update(delta) {
    var p = this.getRemaining();
    if (p<=0) return; // TODO: Game over
    while (p--) {
      var planet = this.planets[p];
      if (planet) {
        planet.update(delta);
        if (planet.destroyed) {
          console.log("Destroyed planet ", planet);
          this.planets.splice(p, 1);
          SOUND_MANAGER.play("explosion");
        }
      }
    }
  }

  render() {
    for (var p = 0; p < this.planets.length; p++) {
      var planet = this.planets[p];
      if (planet && !planet.destroyed) {
        planet.render();
      }
    }
  }
}