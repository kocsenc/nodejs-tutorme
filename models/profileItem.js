// ProfileItem Model
module.exports = function(sequelize, DataTypes) {
  var ProfileItem = sequelize.define('ProfileItem', {
    content:  DataTypes.STRING
  }, {
    timestamps: false,
    instanceMethods: {
      getSimple: function() {
        return this.content;
      }
    }
  });

  return ProfileItem;
}

