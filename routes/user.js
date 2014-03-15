var crypto = require('crypto');
var db = require('../models');
var sha256 = sha256;

exports.create = function(req, res) {
  crypto.randomBytes(12, function(ex, buf) {
    db.User.create(
    {
      type: req.param('type'),
      name: req.param('name'),
      email: req.param('email'),
      password: sha256.update(req.param('password') + '.' + buf.toString('hex')).digest('base64'),
      salt: buf.toString('hex')
    }).success(function() {
      res.send({
        status: 'success'
      });
    });
  });
}

exports.login = function(req, res) {
  db.User.find({ where: { email: req.param('email') } }).success(function(user) {
    var tmpHash = sha256.update(req.param('password') + '.' + user.salt).digest('base64');
    console.log(tmpHash == user.password);
    if (tmpHash == user.password) {
      crypto.randomBytes(24, function(ex, buf) {
        user.updateAttributes({
          token: buf.toString('hex')
        });

        res.send({
          status: 'success',
          token: buf.toString('hex')
        });
      });
    } else {
      res.send({
        status: 'error',
        message: 'Email and/or password may be incorrect.'
      });
    }
  });
};
