// ProfileItem Model
module.exports = function(sequelize, DataTypes) {
  var ProfileItem = sequelize.define('ProfileItem', {
    content:  DataTypes.STRING
  }, {
    timestamps: false,
    associate: function(models) {
    }
  });

  return ProfileItem;
}

