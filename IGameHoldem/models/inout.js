var moment = require('moment');
//require('moment-timezone'); 
//moment.tz.setDefault("Asia/Seoul"); 

module.exports = (sequelize, DataTypes) => {

    const Inout = sequelize.define("Inouts", {
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
        strNickname: {
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
        strDepositor: {
            type:DataTypes.STRING,
        },
        iAmount: {
            type:DataTypes.INTEGER,
        },
        strGivename: {
            type:DataTypes.STRING,
        },
        eUserType: {
            type:DataTypes.ENUM('NORMAL', 'AGENT', 'ADMIN','JOKER'),
        },
        eType: {
            type:DataTypes.ENUM('INPUT', 'OUTPUT', 'BONUS', 'ROLLING', 'SETTLE', 'GIVE', 'TAKE', 'PGIVE', 'PTAKE','PEXCHANGE','EXCHANGE'),
        },
        eState: {
            type:DataTypes.ENUM('REQUEST', 'STANDBY', 'COMPLETE', 'CANCEL'),
        },
        completedAt: {
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('completedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
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
    return Inout;
};
