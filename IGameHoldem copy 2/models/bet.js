let moment = require('moment');

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