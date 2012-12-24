
//This is all that needs
var socket = io.connect('/');

$(function(){
  $('input[name=login]').click(function(e){
    e.preventDefault();
    socket.emit('login', { 
      name: $('input[name=user]').val(), 
      password: $('input[name=pwd]').val(),
    }); 
  });
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
    me = createPlayer($('input[name=user]').val(), true, data.userid);
    stage.addChild(me);
  }
});

/*  */
socket.on('new player', function(data) {
  stage.addChild(createPlayer(data.name, false, data.userid));
});


/* received a message that anohter player moved */
socket.on('client move', function(data){
  convertPlayer(data.player);
});

socket.on('player disconnect', function(data){
  stage.removeChild(players[data.userid]);
  delete players[data.userid];
});

socket.on('create item', function(data){
  convertItem(data.item)
});




// takes in a player object given by the server, and applies it to the corresponding player in players
function convertPlayer(server_player){
  // we iterate over our loop, so if it doesnt exist on the server, we remove it
  for(i in server_player){
    players[server_player.userid][i] = server_player[i];
  }
}

function convertItem(server_item){
  console.log("got an item!");

  return createItem(server_item.x, server_item.y, server_item.id, server_item.width, server_item.height, server_item.type);
}

