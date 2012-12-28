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
// has connected to the server
var connected;
// for the initial loading TODO: REFACTOR!
var init_data;

// DOM elements
var canvas;
var stage;

// Moving objects (all existing players)
var players = {};
var items = {}

// object of you
var me;

// animations
var malePirateSpriteSheet;

// Keypress states
var leftHeld, upHeld, rightHeld, downHeld;
leftHeld = upHeld = rightHeld = downHeld = false;

// Utilities
var preloader;


//on document load, create keyhandlers (same as $(document).ready
$(function () {
  canvas = $('#game')[0];
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  initCanvas();
  eventHandlers();
});


function eventHandlers(){
  $('#game').keydown(function (event) {
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
      case KEYCODE_A: 
        leftHeld = false; 
        socket.emit('server stop', {userid: me.userid});
        break;
      case KEYCODE_UP:
      case KEYCODE_W: 
        upHeld = false; 
        socket.emit('server stop', {userid: me.userid});
        break;
      case KEYCODE_RIGHT:
      case KEYCODE_D: 
        rightHeld = false; 
        socket.emit('server stop', {userid: me.userid});
        break;
      case KEYCODE_DOWN:
      case KEYCODE_S: 
        downHeld = false; 
        socket.emit('server stop', {userid: me.userid});
        break;
    }
  });
}


var initCanvas = function () {
  stage = new createjs.Stage(canvas);
  stage.snapToPixelEnabled = true;
  stage.mouseEventsEnabled = true;

  var manifest = [
    {src: '/images/gem.png', id: 'gem'},
    {src: '/images/pirate_m2.png', id: 'pirate_m2'},
  ];

  preloader = new createjs.PreloadJS();
  preloader.loadManifest(manifest);
  preloader.onComplete = initGame;
};


var initGame = function () {
  createjs.Ticker.addListener(window);
  createjs.Ticker.useRAF = true;
  createjs.Ticker.setFPS(TARGET_FPS);

  if(connected){
    for(i in init_data.players){
      p = init_data.players[i];
      createPlayer("test", false, p.userid, p.x, p.y, p.vX, p.vY); 
    }
    for(i in init_data.items){
      convertItem(init_data.items[i]);
    }

  }
};


var tick = function () {
  var mostRecentKey = Math.max(leftHeld, upHeld, rightHeld, downHeld);
  switch (mostRecentKey) {
    case leftHeld: 
      me.vX = -MOVE_SPEED; 
      socket.emit("server move", { dir: 'L', speed: MOVE_SPEED})
      break;
    case upHeld: 
      me.vY = -MOVE_SPEED; 
      socket.emit("server move", { dir: 'U', speed: MOVE_SPEED})
      break;
    case rightHeld: 
      me.vX = MOVE_SPEED; 
      socket.emit("server move", { dir: 'R', speed: MOVE_SPEED})
      break;
    case downHeld: 
      socket.emit("server move", { dir: 'D', speed: MOVE_SPEED})
      me.vY = MOVE_SPEED; 
      break;
  }
  
  for(i in players){
    players[i].tick();
  }
  for(i in items){
    items[i].tick();
  }
  stage.update();
};
