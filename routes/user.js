var log = require('npmlog');
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
          salt: buf.toString('hex'),
          postal: req.param('postal')
        }).success(function(user) {
          user.setProfile(db.Profile.build({ votes: 1 })).success(function(profile) {
            res.success();
          });
        });
      });
    }
  });
}

// User Login
exports.login = function(req, res) {
  db.User.find({ where: { email: req.param('email') } }).success(function(user) {
    if (!user) {
      res.send({
        status: 'error',
        message: 'Email and/or password may be incorrect.'
      });
    } else {
      var tmpHash = crypto.createHash('sha512').update(req.param('password') + '.' + user.salt).digest('base64');
      if (tmpHash == user.password) {
        crypto.randomBytes(24, function(ex, buf) {
          user.updateAttributes({
            token: buf.toString('hex')
          });
          
          user.getProfile().success(function(profile) {
            res.success({
              token: buf.toString('hex'),
              user: {
                type: user.type,
                name: user.name,
                email: user.email,
                postal: user.postal,
                profile: profile
              }
            });
          });
        });
      } else {
        res.send({
          status: 'error',
          message: 'Email and/or password may be incorrect.'
        });
      }
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

// User Update
exports.update = function(req, res) {
  res.send({ status: 'not_implemented' });
}

// User Delete
exports.delete = function(req, res) {
  req.user.destroy().success(function() {
    res.success();
  });
}

// System cleanup
exports.clearUserTokens = function(callback) {
  db.User.update({ token: null }).success(function() {
    log.info('[\u2713]', 'Authorization tokens cleaned up.');
    callback();
  });
}

