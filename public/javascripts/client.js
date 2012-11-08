var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var KEYCODE_LEFT = 37;  //useful keycode
var KEYCODE_UP = 38;    //useful keycode
var KEYCODE_RIGHT = 39; //useful keycode
var KEYCODE_DOWN = 40;   //useful keycode
var KEYCODE_A = 65;     //useful keycode
var KEYCODE_W = 87;     //useful keycode
var KEYCODE_D = 68;     //useful keycode
var KEYCODE_S = 83;     //useful keycode

var TARGET_FPS = 60;
var MOVE_SPEED = 2;
var MOVE_ANIMATION_SPEED = 3 * MOVE_SPEED; // smaller = faster

// DOM elements
var canvas;
var stage;

// animations
var malePirateSpriteSheet;

// Moving objects
var player;

// Keypress states
var leftHeld, upHeld, rightHeld, downHeld;
leftHeld = upHeld = rightHeld = downHeld = false;

// Utilities
var preloader;


//on document load, create keyhandlers
$(document).ready(function () {
  canvas = $('#game')[0];
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  initCanvas();
  eventHandlers();
 });


function eventHandlers(){
  $(document).keydown(function (event) {
    // cross-browser compatibility
    if (!event) { event = window.event; }
    switch(event.keyCode) {
      // on first key down, mark flag with timestamp
      case KEYCODE_LEFT:
      case KEYCODE_A:
        event.preventDefault();
        if (!leftHeld)
          leftHeld = new Date().getTime();
        break;
      case KEYCODE_UP:
      case KEYCODE_W:
        event.preventDefault();
        if (!upHeld)
          upHeld = new Date().getTime();
        break;
      case KEYCODE_RIGHT:
      case KEYCODE_D:
        event.preventDefault();
        if (!rightHeld)
          rightHeld = new Date().getTime();
        break;
      case KEYCODE_DOWN:
      case KEYCODE_S:
        event.preventDefault();
        if (!downHeld)
          downHeld = new Date().getTime();
        break;
    }
  });

  $(document).keyup(function (event) {
    // cross-browser compatibility
    if (!event) { event = window.event; }
    switch(event.keyCode) {
      // on key up, reset the flag
      case KEYCODE_LEFT:
      case KEYCODE_A: leftHeld = false; break;
      case KEYCODE_UP:
      case KEYCODE_W: upHeld = false; break;
      case KEYCODE_RIGHT:
      case KEYCODE_D: rightHeld = false; break;
      case KEYCODE_DOWN:
      case KEYCODE_S: downHeld = false; break;
    }
  });
}


var initCanvas = function () {
  stage = new createjs.Stage(canvas);
  stage.snapToPixelEnabled = true;
  stage.mouseEventsEnabled = true;

  var manifest = [
    {src: '/images/pirate_m2.png', id: 'pirate_m2'}
  ];

  preloader = new createjs.PreloadJS();
  preloader.onComplete = initGame;
  preloader.loadManifest(manifest);
};


var initGame = function () {
  // Create player character
  var img = preloader.getResult('pirate_m2').src;
  var width = 32;
  var height = 48;
  var moveAnimationSpeed = MOVE_ANIMATION_SPEED;
  player = new Character(img, width, height, moveAnimationSpeed);

  // set id properties
  player.name = 'Me!';
  player.isMe = true;

  // set render properties
  player.gotoAndStop('down');
  player.x = canvas.width/2;
  player.xMin = 0 + width/2;
  player.xMax = canvas.width - width/2;
  player.y = canvas.height / 2;
  player.yMin = 0 + height/2;
  player.yMax = canvas.height - height/2;
  player.snapToPixel = true;

  stage.addChild(player);

  createjs.Ticker.addListener(window);
  createjs.Ticker.useRAF = true;
  createjs.Ticker.setFPS(TARGET_FPS);
};

var tick = function () {
  var mostRecentKey = Math.max(leftHeld, upHeld, rightHeld, downHeld);
  switch (mostRecentKey) {
    case leftHeld: player.vX = -MOVE_SPEED; break;
    case upHeld: player.vY = -MOVE_SPEED; break;
    case rightHeld: player.vX = MOVE_SPEED; break;
    case downHeld: player.vY = MOVE_SPEED; break;
  }
  
  player.tick();
  stage.update();
};
