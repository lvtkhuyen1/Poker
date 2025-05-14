let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const RecordBets = sequelize.define("RecordBets", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        iClass: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        strGroupID: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        iAmount: {
            type:DataTypes.INTEGER,
        },
        // iRollingAdmin: {
        //     type:DataTypes.INTEGER,
        // },
        // iRollingPAdmin: {
        //     type:DataTypes.INTEGER,
        // },
        // iRollingVAdmin: {
        //     type:DataTypes.INTEGER,
        // },
        // iRollingAgent: {
        //     type:DataTypes.INTEGER,
        // },
        // iRollingShop: {
        //     type:DataTypes.INTEGER,
        // },
        strBet: {
            type:DataTypes.STRING,
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

    return RecordBets;
};