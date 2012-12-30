
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.hbs', { title: 'Git In Mah Belleh!' });
};
