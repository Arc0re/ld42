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

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  intersects(rect) {
    return !(rect.x > (this.x + this.w) ||
      (rect.x + rect.w) < this.x ||
      rect.y > (this.y + this.h) ||
      (rect.y + rect.h) < this.y);
  }

  drawCollisionBox() {
    let r = this;
    ctx.strokeStyle = "red";
    ctx.strokeRect(r.x, r.y, r.w, r.h);
  }
}