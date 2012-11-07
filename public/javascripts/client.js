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

var MOVE_SPEED = 7;

// DOM elements
var canvas;
var context;
var stage;

// Moving objects
var player;

// Keypress states
var leftHeld, upHeld, rightHeld, downHeld;

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
    if (!event) { var event = window.event; }
    switch(event.keyCode) {
      // not sure why they return false in the example
      // http://www.createjs.com/Demos/EaselJS/Game.html
      case KEYCODE_LEFT:
      case KEYCODE_A: leftHeld = true; return false;
      case KEYCODE_UP:
      case KEYCODE_W: upHeld = true; return false;
      case KEYCODE_RIGHT:
      case KEYCODE_D: rightHeld = true; return false;
      case KEYCODE_DOWN:
      case KEYCODE_S: downHeld = true; return false;
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
  context = canvas.getContext('2d');

  stage = new createjs.Stage(canvas);
  stage.mouseEventsEnabled = true;

  var manifest = [
    {src: '/images/pirate.png', id: 'player'}
  ];

  preloader = new createjs.PreloadJS();
  preloader.onComplete = initGame;
  preloader.loadManifest(manifest);
};


var initGame = function () {
  player = new createjs.Bitmap(preloader.getResult('player').result);
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  stage.addChild(player);
  stage.update();

  createjs.Ticker.addListener(window);
};


var tick = function () {
  if (leftHeld)
    player.x -= MOVE_SPEED;
  if (upHeld)
    player.y -= MOVE_SPEED;
  if (rightHeld)
    player.x += MOVE_SPEED;
  if (downHeld)
    player.y += MOVE_SPEED;

  stage.update();
};
