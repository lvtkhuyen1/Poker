let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const JackpotRounds = sequelize.define("JackpotRounds", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strGame: {
            type:DataTypes.STRING,
        },
        iBlind: {
            type:DataTypes.INTEGER,
        },
        iLevel1: {
            type:DataTypes.INTEGER,
        },
        iLevel2:{
            type:DataTypes.INTEGER,
        },
        iLevel3: {
            type:DataTypes.INTEGER,
        },
        iJackpot1: {
            type:DataTypes.INTEGER,
        },
        iJackpot2: {
            type:DataTypes.INTEGER,
        },
        iJackpot3: {
            type:DataTypes.INTEGER,
        },
        createdAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    });

    return JackpotRounds;
};