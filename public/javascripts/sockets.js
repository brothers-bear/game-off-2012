
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

socket.on('new_player', function(data) {
  stage.addChild(createPlayer(data.name, false, data.userid));
});





socket.on('client move', function(data){
  console.log('yeah i got the message');
  console.log(data.speed);

  switch (data.dir) {
    case 'L': 
      players[data.userid].vX = -data.speed;
      break;
    case 'U': 
      players[data.userid].vY = -data.speed;
      break;
    case 'R': 
      players[data.userid].vX = data.speed;
      break;
    case 'D': 
      players[data.userid].vY = data.speed;
      break;
  }
});



