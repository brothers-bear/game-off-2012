(function (scope) {
  Item = function(img, width, height, moveAnimationSpeed){
    this.initialize(img, width, height, moveAnimationSpeed);
  }

  var p = Item.prototype = new createjs.BitmapAnimation();

  p.BitmapAnimation_initialize = p.initialize;

  p.initialize = function (img, width, height, moveAnimationSpeed){
    var localSpriteSheet = new createjs.SpriteSheet({
      images: [img],
      frames: {
        width: width,
        height: height,
        regX: width/2,
        regY: height/2
      },
      animations: {
        down: [0, 0, 'down', moveAnimationSpeed],
        left: [1, 1, 'left', moveAnimationSpeed],
        right: [2, 2, 'right', moveAnimationSpeed],
        up: [3, 3, 'up', moveAnimationSpeed]
      }
    });
    this.BitmapAnimation_initialize(localSpriteSheet);

  };

   p.tick = function () {
      this.gotoAndPlay('down');
  };

  scope.Item = Item;
}(window));
