let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const ResultSitgos = sequelize.define("RecordResults", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        lUnique: {
            type:DataTypes.INTEGER,
        },
        iRound: {
            type:DataTypes.INTEGER,
        },
        strWinner: {
            type:DataTypes.STRING,
        },
        strDesc: {
            type:DataTypes.STRING,
        },
        strStartCoin: {
            type:DataTypes.STRING,
        },
        strResultCoin: {
            type:DataTypes.STRING,
        },
        strHand: {
            type:DataTypes.STRING,
        },
        strTablecard: {
            type:DataTypes.STRING,
        },
        iBlind:{
            type:DataTypes.INTEGER,
        },
        iFeeAmount:{
            type:DataTypes.INTEGER,
        },
        iJackpotFeeAmount:{
            type:DataTypes.INTEGER,
        },
        iJackpot: {
            type:DataTypes.INTEGER,
        },
        eGameType: {
            type: DataTypes.ENUM('HOLDEM', 'SITGO', 'TOURNAMENT','BIG2'),
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

    return ResultSitgos;
};