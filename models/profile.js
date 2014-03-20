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
  }, {
    associate: function(models) {
      Profile.hasMany(models.ProfileItem);
      Profile.hasMany(models.ProfileVote);
    }
  });

  return Profile;
}

