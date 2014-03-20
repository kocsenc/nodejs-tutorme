var db = require('../models');

// POST /messages/send/id
exports.send = function(req, res) {
  var contents = req.body.contents;
  if (!contents) {
    res.error('invalid parameters');
  } else {
    db.Message.create({
      contents: contents
    }).success(function(message) {
      req.user.addSentMessage(message);
      req.targetUser.addReceivedMessage(message);
      res.success();
    });
  }
}

// GET /messages
exports.get = function(req, res) {
  // this kind of code is when you know you did it correctly ;)
  req.user.getReceivedMessages().success(function(messages) {
    res.success({
      messages: messages
    });
  });
}

