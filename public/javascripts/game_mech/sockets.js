
//This is all that needs
var socket = io.connect('/');
$(function(){
  $('input[name=login]').click(function(e){
    e.preventDefault();
    socket.emit('login', { 
      username: $('input[name=user]').val(), 
      password: $('input[name=pwd]').val()
    }); 
  });
});

socket.on('item pickup', function(data){
  stage.removeChild(items[data.itemid]);
  delete items[data.itemid];
  // remove it from the stage
  players[data.userid].score++;
});

//Now we can listen for that event
socket.on('onconnected', function( data ) {
  //Note that the data is the object we sent from the server, as is. So we can assume its id exists. 
  console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
  connected = true;
  // load up the existing players and items only after game has loaded

  // for the initial loading TODO: REFACTOR!
  // needed to do this in order to wait for preloader to finish loading
  init_data = data;
  
  // for(i in data.players){
  //   p = data.players[i];
  //   stage.addChild(createPlayer("test", false, p.userid, p.x, p.y, p.vX, p.vY));    
  // }
  // for(i in data.items){
  //   stage.addChild(convertItem(data.items[i]));
  // }

  //create the character, just dont add it in
});

socket.on('loggedin', function(data) {
  if(data.success === true) {
    //create player
    me = createPlayer($('input[name=user]').val(), true, data.userid, PLAYER_WIDTH, PLAYER_HEIGHT);
    stage.addChild(me);
  }
});

/*  */
socket.on('new player', function(data) {
  createPlayer(data.username, false, data.userid, PLAYER_WIDTH, PLAYER_HEIGHT);
});


/* received a message that anohter player moved */
socket.on('client move', function(data){
  updatePlayer(data.player);
});

socket.on('player disconnect', function(data){
  stage.removeChild(players[data.userid]);
  delete players[data.userid];
});

socket.on('create item', function(data){
  convertItem(data.item);
});




// takes in a player object given by the server, and updates the corresponding player in players used by move
function updatePlayer(server_player){
  // we iterate over our loop, so if it doesnt exist on the server, we remove it
  for(var i in server_player){
    players[server_player.userid][i] = server_player[i];
  }
//function createPlayer(name, isMe, userid, p_x, p_y, p_vX, p_vY){
  //return createPlayer(server_player.name, server_player.isMe, server_player);
}

// takes in a player object given by the server, and applies it to the corresponding player in players
function convertPlayer(server_player){
  console.log('created a player!');
  // multiply width by 4/3 to account for server/spritesheet
  return createPlayer(server_player.username, false, server_player.userid, server_player.width * 4/3, server_player.height, server_player.x, server_player.y, server_player.vX, server_player.vY);
}

function convertItem(server_item){
  console.log("got an item!");

  return createItem(server_item.x, server_item.y, server_item.itemid, server_item.width, server_item.height, server_item.type);
}


function createItem(x, y, id, width, height, type){
  // determine img by type
  console.log(preloader.getResult('gem'));
  var img = preloader.getResult('gem').src;
  var moveAnimationSpeed = MOVE_ANIMATION_SPEED;
  var item = new Item(img, width, height, moveAnimationSpeed);

  item.x = x;
  item.y = y;
  item.itemid = id;
  item.gotoAndStop('down');
  item.snapToPixel = true;
  item.type = type;

  items[id] = item; 
  stage.addChild(item);

  return item;
}

// extrapolate player creation
// should be called when player logs in and when other players join
function createPlayer(name, isMe, userid, w, h, p_x, p_y, p_vX, p_vY){
  // Create player character
  var img = preloader.getResult('pirate_m2').src;
  var width = w;
  var height = h;
  var moveAnimationSpeed = MOVE_ANIMATION_SPEED;
  var player = new Character(img, width, height, moveAnimationSpeed);

  // set id properties
  player.username = name;
  player.isMe = isMe;
  player.userid = userid;

  // set render properties
  player.gotoAndStop('down');
  player.x = p_x === undefined ? canvas.width/2 : p_x ;
  player.xMin = 0 + width/2;
  player.xMax = canvas.width - width/2;
  player.y = p_y === undefined ? canvas.height / 2 : p_y;
  player.yMin = 0 + height/2;
  player.yMax = canvas.height - height/2;

  player.vY = p_vY === undefined ? 0 : p_vY;
  player.vX = p_vX === undefined ? 0 : p_vX;

  player.snapToPixel = true;
  players[userid] = player;

  isMe && (me = player);
  stage.addChild(player);
  return player;
}


function sendMessage(){
  var message = $('#chatbox input').val();
  if(message === '') return;
  $('#chatbox input').val('');
  console.log(message);
  socket.emit('chat', {
    username: me.username,
    message: message
  });
}

socket.on('chat', function(data){
  var new_msg = $('#messages p').first().clone();
  new_msg.find('.user').text(data.username);
  new_msg.find('.message').text(data.message);
  new_msg.appendTo('#messages');
});


