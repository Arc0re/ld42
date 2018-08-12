class Projectiles {
  constructor() {
    this.projectiles = [];
  }

  add(projectile) {
    this.projectiles.push(projectile);
  }

  update(delta) {
    var p = this.projectiles.length;
    if (p<=0) return;
    while (p--) {
      var projectile = this.projectiles[p];
      if (projectile) {
        projectile.update(delta);
        if (projectile.markedForDeletion) {
          //console.log("Destroying projectile nb : ", p, projectile);
          projectile.arrived = true;
          this.projectiles.splice(p, 1);
        }
      }
    }
  }

  render() {
    for (var p=0; p<this.projectiles.length; p++) {
      var proj = this.projectiles[p];
      if (proj) proj.sprite.render();
    }
  }
}