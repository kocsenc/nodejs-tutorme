// Profile Model
module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define('Profile', {
    tagLine: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    associate: function(models) {
      Profile.hasMany(models.ProfileItem);
    }
  });

  return Profile;
}

