var Utils = {
  randInt: function (from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  },
  getMousePos: function (canvas, evt) {
    https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  },
  Vector : function (x, y) {
    this.x = x;
    this.y = y;
  },
  vector: {
    add(vec1, vec2) {
      return {x: vec1.x + vec2.x, y: vec1.y + vec2.y};
    },
    sub(vec1, vec2) {
      return {x: vec1.x - vec2.x, y: vec1.y - vec2.y};
    },
    mul(vec1, vec2) {
      return {x: vec1.x*vec2.x, y: vec1.y*vec2.y};
    },
    len(vec) {
      return Math.sqrt(vec.x*vec.x + vec.y*vec.y);
    },
    dist(vec1, vec2) {
      return this.len(this.sub(vec2, vec1));
    },
    normalize(vec) {
      return {x: vec.x/this.len(vec), y: vec.y/this.len(vec)}
    }
  }
};

class TargetData {
  constructor(start, end, direction, distance) {
    this.start = start;
    this.end = end;
    this.direction = direction;
    this.distance = distance;
  }
}