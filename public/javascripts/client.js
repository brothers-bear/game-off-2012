var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT= 600;

var KEYCODE_LEFT = 37;  //useful keycode
var KEYCODE_UP = 38;    //useful keycode
var KEYCODE_RIGHT = 39; //useful keycode
var KEYCODE_DOWN= 40;   //useful keycode
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
  canvas.height= CANVAS_HEIGHT;
  initCanvas();
  eventHandlers();
 });


function eventHandlers(){
  $(document).keydown(function (event) {
    // cross-browser compatibility
    if (!event) { event = window.event; }
    switch(event.keyCode) {
      // not sure why they return false in the example
      // http://www.createjs.com/Demos/EaselJS/Game.html
      case KEYCODE_LEFT:
      case KEYCODE_A:
        if (!leftHeld)
          leftHeld = new Date().getTime();
        break;
      case KEYCODE_UP:
      case KEYCODE_W:
        if (!upHeld)
          upHeld = new Date().getTime();
        break;
      case KEYCODE_RIGHT:
      case KEYCODE_D:
        if (!rightHeld)
          rightHeld = new Date().getTime();
        break;
      case KEYCODE_DOWN:
      case KEYCODE_S:
        if (!downHeld)
          downHeld = new Date().getTime();
        break;
    }
  });

  $(document).keyup(function (event) {
    // cross-browser compatibility
    if (!event) { event = window.event; }
    switch(event.keyCode) {
      // not sure why they return false in the example
      // http://www.createjs.com/Demos/EaselJS/Game.html
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
    {src: '/images/pirate_m2.png', id: 'player'}
  ];

  preloader = new createjs.PreloadJS();
  preloader.onComplete = initGame;
  preloader.loadManifest(manifest);
};


var initGame = function () {
  malePirateSpriteSheet= new createjs.SpriteSheet({
    'images': ['/images/pirate_m2.png'],
    'frames': { width: 32, height: 48, regX: 16, regY: 24 },
    'animations': {
      down: [0, 3, 'down', MOVE_ANIMATION_SPEED],
      left: [4, 7, 'left', MOVE_ANIMATION_SPEED],
      right: [8, 11, 'right', MOVE_ANIMATION_SPEED],
      up: [12, 15, 'up', MOVE_ANIMATION_SPEED]
    }
  });

  player = new createjs.BitmapAnimation(malePirateSpriteSheet);
  player.gotoAndStop('down');
  player.name = 'Male Pirate';
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.snapToPixel = true;

  stage.addChild(player);

  createjs.Ticker.addListener(window);
  createjs.Ticker.useRAF = true;
  createjs.Ticker.setFPS(TARGET_FPS);
};

// TODO: should really be refactored into player object
var updateAnimation = function (player, direction) {
  player.paused = false;
  if (player.currentAnimation != direction)
    player.gotoAndPlay(direction);
};


var tick = function () {
  var mostRecentKey = Math.max(leftHeld, upHeld, rightHeld, downHeld);
  switch (mostRecentKey) {
    case leftHeld:
      player.x -= MOVE_SPEED;
      updateAnimation(player, 'left');
      break;
    case upHeld:
      player.y -= MOVE_SPEED;
      updateAnimation(player, 'up');
      break;
    case rightHeld:
      player.x += MOVE_SPEED;
      updateAnimation(player, 'right');
      break;
    case downHeld:
      player.y += MOVE_SPEED;
      updateAnimation(player, 'down');
      break;
    default:
      player.paused = true;
  }

  stage.update();
};
