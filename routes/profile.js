var crypto = require('crypto');
var db = require('../models');

// GET /profiles/id
exports.get = function(req, res) {
  if (req.targetUser.isTutor) {
    req.targetUser.getProfile().success(function(profile) {
      res.success({
        profile: profile
      });
    });
  } else {
    res.error('user is not a tutor');
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
  if (req.targetUser.isTutor) {
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
  } else {
    res.error('user is not a tutor');
  }
}

