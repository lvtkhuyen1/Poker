let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const Jackpots = sequelize.define("Jackpots", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strGame: {
            type:DataTypes.STRING,
        },
        iLevel1Amount: {
            type:DataTypes.INTEGER,
        },
        iLevel2Amount: {
            type:DataTypes.INTEGER,
        },
        iLevel3Amount:{
            type:DataTypes.INTEGER,
        },
        iLevel1Round: {
            type:DataTypes.INTEGER,
        },
        iLevel2Round: {
            type:DataTypes.INTEGER,
        },
        iLevel3Round:{
            type:DataTypes.INTEGER,
        },
        iJackpot:{
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

    return Jackpots;
};