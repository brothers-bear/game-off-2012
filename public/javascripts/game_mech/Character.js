(function (scope) {
  Character = function (img, width, height, moveAnimationSpeed) {
    this.initialize(img, width, height, moveAnimationSpeed);
  };

  var p = Character.prototype = new createjs.BitmapAnimation();

  p.BitmapAnimation_initialize = p.initialize;

  p.initialize = function (img, width, height, moveAnimationSpeed) {
    var localSpriteSheet = new createjs.SpriteSheet({
      images: [img],
      frames: {
        width: width,
        height: height,
        regX: width/2,
        regY: height/2
      },
      animations: {
        down: [0, 3, 'down', moveAnimationSpeed],
        left: [4, 7, 'left', moveAnimationSpeed],
        right: [8, 11, 'right', moveAnimationSpeed],
        up: [12, 15, 'up', moveAnimationSpeed]
      }
    });
    this.BitmapAnimation_initialize(localSpriteSheet);

    this.facing = 'down';
    this.gotoAndStop(this.facing);

    this.isMe = false;

    this.vX = 0;
    this.vY = 0;
  };

  p.moving = function () {
    if (this.vX < 0) { return 'left'; }
    if (this.vX > 0) { return 'right'; }
    if (this.vY < 0) { return 'up'; }
    if (this.vY > 0) { return 'down'; }
    return false;
  };

  p.againstBoundary = function (direction) {
    switch (direction) {
      case 'left':
        return this.x <= this.xMin;
      case 'right':
        return this.x >= this.xMax;
      case 'up':
        return this.y <= this.yMin;
      case 'down':
        return this.y >= this.yMax;
    }
  };

  p.tick = function () {
    var moving = this.moving();
    if (moving) {
      if (!this.againstBoundary(moving)) {
        // not trying to move against a boundary
        this.paused = false;

        this.x += this.vX;
        this.y += this.vY;

        // if we are moving in a new direction
        if (moving !== this.facing) {
          this.facing = moving;
          this.gotoAndPlay(this.facing);
        }
      } else { // trying to move against boundary
        this.paused = true;
      }
      this.vX = 0;
      this.vY = 0;
    } else { // not moving
      this.paused = true;
    }
  };

  scope.Character = Character;
}(window));
