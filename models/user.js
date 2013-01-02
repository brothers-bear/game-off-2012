var mongoose = require('mongoose'),
    crypto = require('crypto')
    ;

var User = new mongoose.Schema({ username: String, h_password: String, salt: String });

User.methods.makeSalt = function(){
  return Math.round(new Date().valueOf() * Math.random() + '');
};

User.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

User.methods.authenticate = function(plain_pass){
  return this.encryptPassword(plain_pass === this.hashed_password);
};

User.virtual('password').get(function(){
  return this.hashed_password;
}).set(function(password){
  this.salt = this.makeSalt;
  this.hashed_password = this.encryptPassword(password);
  console.log('password has been hashed and created!');
});

module.exports = mongoose.model('User', User);
