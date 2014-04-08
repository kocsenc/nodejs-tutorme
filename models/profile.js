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
    },
    instanceMethods: {
      getSimple: function() {
        var obj = {};
        
        obj.tagLine = this.tagLine;
        obj.description = this.description;
        obj.profileItems = [];

        this.profileItems.forEach(function(profileItem) {
          obj.profileItems.push(profileItem.getSimple());
        });
        
        return obj;
      }
    }
  });

  return Profile;
}

