
var io  = require('socket.io')
  , UUID = require('node-uuid')
  ;
exports.start = function(server){
  console.log('hi');


  // game info
  /* Players:
   * 
   */
  var players = {};

      var new_player = {
        userid: client.userid,
        name: data.name,
        vX: 0,
        vY: 0,
        x: 400,
        y: 300
      }

  var FPS = 60;

  /* Socket.IO server set up. */

  //Express and socket.io can work together to serve the socket.io client files for you.
  //This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.
          
  //Create a socket.io instance using our express server
  var sio = io.listen(server);

  //Configure the socket.io connection settings. 
  //See http://socket.io/
  sio.configure(function (){
    sio.set('log level', 0);
    sio.set('authorization', function (handshakeData, callback) {
      callback(null, true); // error first callback style 
    });
  });

  //Socket.io will call this function when a client connects, 
  //So we can send that client a unique ID we use so we can 
  //maintain the list of players.
  sio.sockets.on('connection', function (client) {
    //Generate a new UUID, looks something like 
    //5b2ca132-64bd-4513-99da-90e838ca47d1
    //and store this on their socket/connection
    client.userid = UUID();
    //tell the player they connected, giving them their id
    client.emit('onconnected', { 
      id: client.userid,
      players: players
    } );
    //Useful to know when someone connects
    console.log('\t socket.io:: player ' + client.userid + ' connected');
    //When this client disconnects
    client.on('disconnect', function () {
      //Useful to know when someone disconnects
      console.log('\t socket.io:: client disconnected ' + client.userid );
      // remove the player from the array
      delete players[client.userid];
      client.broadcast.emit('player disconnect', { userid: client.userid });
    }); // client.on disconnect
    client.on('login', function (data) {
      console.log('user:' + data.name + ' pwd:' + data.password); 
      // if successful, return player object back, and push a new player to list
      var new_player = {
        userid: client.userid,
        name: data.name,
        vX: 0,
        vY: 0,
        x: 400,
        y: 300
      }

      players[client.userid] = new_player;
      // for future logging in, check auth (success)
      client.emit('loggedin', { 
          success: true, 
          userid: client.userid,
      });
      // broadcast to all other sockets
      client.broadcast.emit('new player', { name: data.name, userid: client.userid });
    });


    /* movement messages */
    client.on('server move', function(data){

      switch (data.dir) {
        case 'L': 
          players[client.userid].vX = -data.speed;
          break;
        case 'U': 
          players[client.userid].vY = -data.speed;
          break;
        case 'R': 
          players[client.userid].vX = data.speed;
          break;
        case 'D': 
          players[client.userid].vY = data.speed;
          break;
      }
      // emit to all sockets (including client self) so that client's side is made sure to be the same
      sio.sockets.emit('client move', { player: players[client.userid] });    


      

    });

    // receives the player id that stops, updates their vx and vy
    client.on('server stop', function(data){
      players[data.userid].vX = 0;
      players[data.userid].vY = 0;
    });
    
  }); //sio.sockets.on connection

  //update movement
  function gameTick(){
    for(i in players) {
      p = players[i];
      p.x = p.x + p.vX;
      p.y = p.y + p.vY;
      // redo x and y so it isn't beyond boundaries
    }
    // check for collision: Quadtree implementation
    
  }

  setInterval(gameTick, 1000/FPS); 

}
