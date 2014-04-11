// Sequelize Initialization
var log       = require('npmlog');
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var lodash    = require('lodash');
var config    = require('../config');
var db        = {};
var sequelize = new Sequelize(
  config.environment[config.mode].db.name,
  config.environment[config.mode].db.user,
  config.environment[config.mode].db.password,
  {
    logging: function(message) {
      log.info('[\u2713]', message);
    }
  }
);

fs.readdirSync(__dirname).filter(function(file) {
  return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) == '.js'))
}).forEach(function(file) {
  var model = sequelize.import(path.join(__dirname, file))
  db[model.name] = model
});

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);

