let moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Fees = sequelize.define("Fees", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    fHoldem: {
      type: DataTypes.FLOAT,
      // allowNull: false,
    },
    fBig2: {
      type: DataTypes.FLOAT,
      // allowNull: false,
    },
    fSitGo: {
      type: DataTypes.FLOAT,
      // allowNull: false,
    },
    fBaccarat: {
      type: DataTypes.FLOAT,
      // allowNull: false,
    },
    fOmaha: {
      type: DataTypes.FLOAT,
      // allowNull: false,
    },
    fJackpot: {
      type: DataTypes.FLOAT,
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
  });

  return Fees;
};
