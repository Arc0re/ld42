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
  health: 20
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
  health: 50
};

const MAX_PLANET_PIXEL_SIZE = 16*8;

class Planets {
  constructor() {
    this.planets = [];
    this.planets.push(new Planet("small_blue_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "blue", SMALL_PLANET_DATA));
    this.planets.push(new Planet("small_red_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "red", SMALL_PLANET_DATA));
    this.planets.push(new Planet("small_sand_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "sand", SMALL_PLANET_DATA));
    this.planets.push(new Planet("medium_ice_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "ice", MEDIUM_PLANET_DATA));
    this.planets.push(new Planet("medium_red_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "red", MEDIUM_PLANET_DATA));
    this.planets.push(new Planet("small_blue_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "blue", SMALL_PLANET_DATA));
    this.planets.push(new Planet("small_red_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "red", SMALL_PLANET_DATA));
    this.planets.push(new Planet("small_sand_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "sand", SMALL_PLANET_DATA));
    this.planets.push(new Planet("medium_ice_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "ice", MEDIUM_PLANET_DATA));
    this.planets.push(new Planet("medium_red_planet", {x: Utils.randInt(0, canvas.width-MAX_PLANET_PIXEL_SIZE), y: Utils.randInt(0, canvas.height-MAX_PLANET_PIXEL_SIZE)}, "red", MEDIUM_PLANET_DATA));
    for (var p = 0; p < this.planets.length; p++) this.planets[p].init();
  }

  getRemaining() {
    return this.planets.length;
  }

  getPlanet(index) {
    return this.planets[index];
  }

  render() {
    for (var p = 0; p < this.planets.length; p++) {
      var planet = this.planets[p];
      if (planet) {
        planet.render();
      }
    }
  }
}