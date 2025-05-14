let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const FeeRanges = sequelize.define("FeeRanges", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strGame: {
            type:DataTypes.STRING
        },
        fClass1Max: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass1Min: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass2Max: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass2Min: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass3Max: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass3Min: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass4Max: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass4Min: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass5Max: {
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        fClass5Min: {
            type:DataTypes.FLOAT,
            allowNull: false,
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

    return FeeRanges;
};