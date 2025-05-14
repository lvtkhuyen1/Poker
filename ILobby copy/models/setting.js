let moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

//const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {

    const Fees = sequelize.define("Setting", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strName: {
            type:DataTypes.STRING,
            // allowNull: false,
        },
        iOnOff: {
            type:DataTypes.INTEGER,
            // allowNull: false,
        },
        strContents: {
            type:DataTypes.STRING,
            // allowNull: false,
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

    return Fees;
};