var db = require('../models');

exports.index = function(req, res){
  db.User.findAll({
  }).success(function(users) {
    res.render('index', {
      title: 'Express',
      users: users
    });
  });
}
