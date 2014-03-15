var crypto = require('crypto');
var db = require('../models');

// User Registration
exports.register = function(req, res) {
  db.User.find({ where: { email: req.param('email') } }).success(function(user) {
    if (user) {
      res.send({
        status: 'error',
        message: 'Oops, a user with that email already exists.'
      });
    } else {
      crypto.randomBytes(12, function(ex, buf) {
        db.User.create(
        {
          type: req.param('type'),
          name: req.param('name'),
          email: req.param('email'),
          password: crypto.createHash('sha512').update(req.param('password') + '.' + buf.toString('hex')).digest('base64'),
          salt: buf.toString('hex')
        }).success(function() {
          res.send({
            status: 'success'
          });
        });
      });
    }
  });
}

// User Login
exports.login = function(req, res) {
  db.User.find({ where: { email: req.param('email') } }).success(function(user) {
    var tmpHash = crypto.createHash('sha512').update(req.param('password') + '.' + user.salt).digest('base64');
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
}

// User Logout
exports.logout = function(req, res) {
  db.User.find({ where: { email: req.param('email') } }).success(function(user) {
    user.updateAttributes({ token: null });

    res.send({ status: 'success' });
  });
}

