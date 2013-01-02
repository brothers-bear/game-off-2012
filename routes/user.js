var User = require('../models/user.js');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.p_signup = function(req, res){
  new_user = new User(req.body.user);
};
