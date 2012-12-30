var PLAYER_WIDTH = 32 * 3/4; // to account for the empty space in the spritesheets
var PLAYER_HEIGHT = 48;

function sPlayer(id, name, width, height, x, y, vX, vY){
  this.userid = id;
  this.username = name;
  this.width = width || PLAYER_WIDTH;
  this.height = height || PLAYER_HEIGHT;
  this.x = x || 400;
  this.y = y || 300;
  this.vX = vX || 0;
  this.vY = vY || 0;
  this.score = 0;

}

exports.sPlayer = sPlayer;
