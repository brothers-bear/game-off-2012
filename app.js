
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
  , game_server = require('./server/game_server.js')
  ;
  
exports.server = server;

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


// pass in the server. Not sure if this is how i should be doing this. Possibly ask this on stackoverflow?
game_server.start(server);

//console.log(server);

// for debugging, returns files
// app.get('/*', admin.files);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

