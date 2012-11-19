
//This is all that needs
var socket = io.connect('/');

$(function(){
  $('input[name=login]').click(function(e){
    e.preventDefault();
    console.log("yeah!");
    socket.emit('login', { name: $('input[name=user]').val(), password: $('input[name=pwd]').val()}); 
  });
});

//Now we can listen for that event
socket.on('onconnected', function( data ) {
  //Note that the data is the object we sent from the server, as is. So we can assume its id exists. 
  console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
});

socket.on('loggedin', function(data) {
  console.log('LOGGED IN');
  if(data.success = true) {
    //create player
    createPlayer($('input[name=user]').val(), true);
  }
});

socket.on('new_player', function(data) {
  createPlayer(data.name, false);
});

