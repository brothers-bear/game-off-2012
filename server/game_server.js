var io  = require('socket.io'),
    UUID = require('node-uuid'),
    QuadTree = require('./QuadTree.js').QuadTree,
    _ = require('underscore'),
    sPlayer = require('./sPlayer.js').sPlayer,
    sItem = require('./sItem.js').sItem
  ;

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

exports.start = function(server){
  var sio = io.listen(server);
  console.log('Server started!');


  // game info
  /* Players:
   * 
   */
  var players = {};
  var items = {};

  var map = new QuadTree({left:0, right:CANVAS_WIDTH, top: 0, bottom: CANVAS_HEIGHT}, 3, 4);
  

  var FPS = 60;
  /* Socket.IO server set up. */

  //Express and socket.io can work together to serve the socket.io client files for you.
  //This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.
          
  //Create a socket.io instance using our express server

  createServerItem(Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,0,16,16,"power");

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
      players: players,
      items: items
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
      console.log('user:' + data.username + ' pwd:' + data.password); 
      // if successful, return player object back, and push a new player to list
      var new_player = new sPlayer(client.userid, data.username);
      map.insert(new_player);
      console.log(map);
      console.log(map);
      //map.printTree();

      players[client.userid] = new_player;
      // for future logging in, check auth (success)
      client.emit('loggedin', { 
          success: true, 
          userid: client.userid
      });
      // broadcast to all other sockets
      client.broadcast.emit('new player', { username: data.username, userid: client.userid });
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

    client.on('chat', function(data){
      // should check for server validation here
      console.log(data.message);
      console.log(data.username);
      sio.sockets.emit('chat', data);
    });
    
  }); //sio.sockets.on connection



  



  //update movement
  function gameTick(){
    for(var i in players) {
      // console.log("is it colliding?");
      // console.log("this is colliding: " + map.colliding(players[i]));
      
      p = players[i];
      p.x = p.x + p.vX;
      p.y = p.y + p.vY;
      var collision = map.colliding(players[i]);
      

      if(collision){
        // if there's an item collision 
        
        
        if(typeof collision.itemid !== 'undefined') {
          // collected an item!
          map.remove(collision);
          delete items[collision.itemid];
          sio.sockets.emit('item pickup', {
            itemid: collision.itemid, 
            userid: p.userid
          });
          p.score++;
          // generate a new one
          createServerItem(Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,0,16,16,"power");
        }
        // if there are collisions, don't move this guy, but move him backwards to get out of the collision
        else {
          p.x = p.x - p.vX;
          p.y = p.y - p.vY;


        }
        
      }
      // redo x and y so it isn't beyond boundaries
    }
    for(var j in items) {
      item = items[j];
      item.x = item.x;
      item.y = item.y;
      // redo x and y so it isn't beyond boundaries
    }
    // check for collision: Quadtree implementation
    
    // if(map.root.players.length > 0){
    //   console.log('yes!');
    //   console.log(map.root.players[0]);
    //   console.log(map.root.players[1]);
    // }
    //console.log(map)
    map.clear();
    //console.log(map)
    _.each(players, function(item){ map.insert(item); });
    _.each(items, function(item){ map.insert(item); });
    
  }

  setInterval(gameTick, 1000/FPS); 

  function createServerItem(x, y, id, width, height, type){
    items[id] = new sItem(x, y, id, width, height, type);
    sio.sockets.emit('create item', { item: items[id]});
    return items[id];
  }
  

};

