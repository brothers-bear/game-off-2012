// returns files
var verbose = false;

exports.files = function(req, res){
  //This is the current file they have requested
  var file = req.params[0]; 
  //For debugging, we can track what files are requested.
  if(verbose) console.log('\t :: Express :: file requested : ' + file);
  res.sendfile( __dirname + '/' + file );
  res.render('index', { title: 'Git In Mah Belleh!' });
};
