const moment = require("moment");

module.exports = function (sequelize, Sequelize) {
  const Users = sequelize.define("Users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    strID: {
      type: Sequelize.STRING,
      unique: true, // 중복값을 허용하지 않음
    },
    strName: {
      type: Sequelize.STRING,
    },
    eUserType: {
      type: Sequelize.ENUM("NORMAL", "AGENT", "ADMIN", "JOKER"),
    },
    strPassword: {
      type: Sequelize.STRING,
    },
    strEMail: {
      type: Sequelize.STRING,
    },
    strNickname: {
      type: Sequelize.STRING,
      unique: true,
    },
    strImage: {
      type: Sequelize.STRING,
    },
    strGroupID: {
      type: Sequelize.STRING,
    },
    eStatus: {
      type: Sequelize.ENUM("NORMAL", "FORBIDDEN", "LOCKED", "QUIT"),
    },
    eAuthenticated: {
      type: Sequelize.ENUM("NONE", "COMPLETE"),
    },
    iAvatar: {
      type: Sequelize.INTEGER,
    },
    iLevel: {
      type: Sequelize.INTEGER,
    },
    iExp: {
      type: Sequelize.INTEGER,
    },
    iWin: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    iLose: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    iPoint: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    iCash: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    iPointBase: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    iCashBase: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    iRolling: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    strDesc: {
      type: Sequelize.TEXT,
    },
    strBank: {
      type: Sequelize.STRING,
    },
    strAccount: {
      type: Sequelize.STRING,
    },
    strMobileNo: {
      type: Sequelize.STRING,
    },
    strOptionCode: {
      type: Sequelize.STRING,
    },
    fHoldemR: {
      type: Sequelize.FLOAT,
    },
    fBig2R: {
      type: Sequelize.FLOAT,
    },
    fSitgoR: {
      type: Sequelize.FLOAT,
    },
    fOmahaR: {
      type: Sequelize.FLOAT,
    },
    fBaccaratR: {
      type: Sequelize.FLOAT,
    },
    fSettle: {
      type: Sequelize.FLOAT,
    },
    iParentID: {
      type: Sequelize.INTEGER,
    },
    iClass: {
      type: Sequelize.INTEGER,
    },
    strIP: {
      type: Sequelize.STRING,
    },
    strIPlogin: {
      type: Sequelize.STRING,
    },
    strURL: {
      type: Sequelize.STRING,
    },
    fBreakage: {
      type: Sequelize.FLOAT,
    },
    createdAt: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD");
      },
    },
    updatedAt: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
    loginedAt: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("loginedAt")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
    lastActive: {
      type: Sequelize.DATE,
    },
    bLogin: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    eLocation: {
      type: Sequelize.ENUM("LOBBY", "HOLDEM", "SITGO", "BIG2"),
      defaultValue: "LOBBY",
    },
  });

  return Users;
};
