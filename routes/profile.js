var crypto = require('crypto');
var db = require('../models');
require('string_score');

// POST /profiles/id
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
  console.log('trying search');
  if(req.body.query) {
    db.User.findAll({ where: { type: 1 }, include: [ { model: db.Profile, include: [ { model: db.ProfileItem } ] } ] }).success(function(tutors) {
      var results = new Array();
      
      // this is gross, please refactor...
      tutors.forEach(function(tutor) {
        tutor.profile.profileItems.forEach(function(profileItem) {
          if (profileItem.content.score(req.body.query) > 0.2) {
            var simpleTutorObj = tutor.getSimple();
            if (!(simpleTutorObj in results)) {
              results.push(simpleTutorObj);
            }
          }
        });
      });

      res.success({ results: results });
    });
  } else {
    res.error('no query provided');
  }
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

