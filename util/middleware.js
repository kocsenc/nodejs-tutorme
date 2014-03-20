var exceptions = require('./exceptions');

exports.resUtils = function (req, res, next) {
  res.error = function(message) {
    if (message) {
      res.send({
        status: 'error',
        message: message
      });
    } else {
      throw new exceptions.IllegalArgumentException('invalid message');
    }
  }

  res.success = function(resObj) {
    if (!resObj) {
      resObj = {};
    }
    
    resObj.status = 'success';
    res.send(resObj);
  }

  next();
}
