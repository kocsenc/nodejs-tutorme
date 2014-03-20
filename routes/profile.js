var crypto = require('crypto');
var db = require('../models');

// GET /profiles/id
exports.get = function(req, res) {
  if (req.body.id) {
    db.User.find({ where: { id: req.body.id } }).success(function(tutor) {
      if (tutor.type == 1) {
        tutor.getProfile().success(function(profile) {
          res.send({
            status: 'success',
            profile: profile
          });
        });
      } else {
        res.send({
          status: 'error',
          message: 'user is not a tutor'
        });
      }
    });
  } else {
    res.send({
      status: 'error',
      message: 'invalid parameters'
    });
  }
}

// POST /profiles/update
exports.update = function(req, res) {
  res.send({ status: 'not_implemented' });
}

// POST /profiles/search
exports.search = function(req, res) {
  res.send({ status: 'not_implemented' });
}

// POST /profiles/vote/id
exports.vote = function(req, res) {
  db.User.find({ where: { id: req.param('id') } }).success(function(tutor) {
    if (tutor) {
      if (tutor.type == 1) {
        tutor.getProfile().success(function(profile) {
          db.ProfileVote.find({ where: { UserId: req.user.id } }).success(function(vote) {
            if (vote) {
              res.error('already voted for this profile');
            } else {
              db.ProfileVote.create({ ProfileId: profile.id, UserId: req.user.id }).success(function(profileVote) {
                res.success();
              });
            }
          });
        });
      }
    } else {
      res.error('no such user');
    }
  });
}

