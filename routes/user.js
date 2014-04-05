var log = require('npmlog');
var crypto = require('crypto');
var db = require('../models');

// POST /users/register
exports.register = function(req, res) {
  db.User.find({ where: { email: req.body.email } }).success(function(user) {
    if (user) {
      res.send({
        status: 'error',
        message: 'Oops, a user with that email already exists.'
      });
    } else {
      crypto.randomBytes(12, function(ex, buf) {
        db.User.create(
        {
          type: parseInt(req.body.type),
          name: req.body.name,
          email: req.body.email,
          password: crypto.createHash('sha512').update(req.body.password + '.' + buf.toString('hex')).digest('base64'),
          salt: buf.toString('hex'),
          postal: req.body.postal
        }).success(function(user) {
          if (user.isTutor) {
            user.setProfile(db.Profile.build()).success(function(profile) {
              res.success();
            });
          } else {
            res.success();
          }
        });
      });
    }
  });
}

// POST /users/login
// TODO: Refactor login
exports.login = function(req, res) {
  db.User.find({ where: { email: req.body.email } }).success(function(user) {
    if (!user) {
      res.error('Email and/or password may be incorrect.');
    } else {
      var tmpHash = crypto.createHash('sha512').update(req.body.password + '.' + user.salt).digest('base64');
      if (tmpHash === user.password) {
        crypto.randomBytes(24, function(ex, buf) {
          user.updateAttributes({
            token: buf.toString('hex')
          });
          
          if (user.isTutor) {
            log.info('[LOGIN]', 'User is a tutor.');
            user.getProfile().success(function(profile) {
              db.ProfileVote.count({ where: { ProfileId: profile.id } }).success(function(count) {
                log.info('[LOGIN]', 'Profile has ' + count + ' vote(s).');
                res.success({
                  token: buf.toString('hex'),
                  user: {
                    type: user.type,
                    name: user.name,
                    email: user.email,
                    postal: user.postal,
                    profile: {
                      tagLine: profile.tagLine,
                      description: profile.description,
                      votes: count
                    }
                  }
                });
              });
            });
          } else {
            log.info('[LOGIN]', 'User is a student.');
            res.success({
              token: buf.toString('hex'),
              user: {
                type: user.type,
                name: user.name,
                email: user.email,
                postal: user.postal
              }
            });
          }
        });
      } else {
        res.error('Email and/or password may be incorrect.');
      }
    }
  });
}

// POST /users/logout
exports.logout = function(req, res) {
  req.user.updateAttributes({ token: null }).success(function() {
    res.success();
  });
}

// POST /users/update
exports.update = function(req, res) {
  res.send({ status: 'not_implemented' });
}

// DELETE /users
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

