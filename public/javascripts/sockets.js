
//This is all that needs
var socket = io.connect('/');

$(function(){
  $('input[name=login]').click(function(e){
    e.preventDefault();
    console.log("yeah!");
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
  for(i in data.players){
    p = data.players[i];
    console.log("this is sparta!!")
    console.log(p);
    stage.addChild(createPlayer("test", false, p.userid, p.x, p.y, p.vX, p.vY));    
  }

  //create the character, just dont add it in
});

socket.on('loggedin', function(data) {
  console.log('LOGGED IN');
  console.log(data.success);
  console.log(data.userid);
  console.log('end');
  if(data.success === true) {
    //create player
    me = createPlayer($('input[name=user]').val(), true, data.userid);
    stage.addChild(me);
    console.log('yes its here:');
    console.log(me);
  }
});

/*  */
socket.on('new player', function(data) {
  stage.addChild(createPlayer(data.name, false, data.userid));
});


// takes in a player object given by the server, and applies it to the corresponding player in players
function convertPlayer(server_player){
  for(i in server_player){
    players[server_player.userid][i] = server_player[i];
  }
}


/* received a message that anohter player moved */
socket.on('client move', function(data){
  console.log('yeah i got the message');
  console.log(data.player);
  convertPlayer(data.player);
});



