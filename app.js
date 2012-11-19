
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , app = express()
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path')
  , server = http.createServer(app)
  , io   = require('socket.io')
  , UUID = require('node-uuid')

  ;

  

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);


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
  client.emit('onconnected', { id: client.userid } );
  //Useful to know when someone connects
  console.log('\t socket.io:: player ' + client.userid + ' connected');
  //When this client disconnects
  client.on('disconnect', function () {
    //Useful to know when someone disconnects
    console.log('\t socket.io:: client disconnected ' + client.userid );
  }); // client.on disconnect
  client.on('login', function (data) {
    console.log('user:' + data.name + ' pwd:' + data.password); 
    // for future logging in
    client.emit('loggedin', { success: true });
    // broadcast to all other sockets
    client.broadcast.emit('new_player', { name:data.name });
  });
  
}); //sio.sockets.on connection


// for debugging, returns files
// app.get('/*', admin.files);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
