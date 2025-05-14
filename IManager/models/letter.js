const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Letters = sequelize.define("Letters", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strTo: {
            type:DataTypes.STRING,
        },
        strToNickname: {
            type:DataTypes.STRING,
        },
        strFrom: {
            type:DataTypes.STRING,
        },
        strFromNickname: {
            type:DataTypes.STRING,
        },
        strSubject: {
            type:DataTypes.STRING,
        },
        strContents: {
            type:DataTypes.TEXT,
        },
        strAnswer: {
            type:DataTypes.TEXT,
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
        eState: {
            type:DataTypes.ENUM('UNREAD', 'READED'),
        },
        eType: {
            type:DataTypes.ENUM('LETTER', 'CONSULTING'),
        },
    });

    return Letters;
};