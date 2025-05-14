const moment = require('moment');

module.exports = function (sequelize, Sequelize) {

    const Users = sequelize.define('Users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        strID: {
            type: Sequelize.STRING,
            unique: true, // 중복값을 허용하지 않음
        },
        strName: {
            type: Sequelize.STRING,
        },
        eUserType: {
            type: Sequelize.ENUM('NORMAL', 'AGENT', 'ADMIN','JOKER'),
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
            type: Sequelize.STRING
        },
        strGroupID: {
            type: Sequelize.STRING,
        },
        eStatus: {
            type: Sequelize.ENUM('NORMAL', 'FORBIDDEN', 'LOCKED', 'QUIT'),
        },
        eAuthenticated: {
            type: Sequelize.ENUM('NONE', 'COMPLETE'),
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
            defaultValue: 0
        },
        iLose: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        iPoint: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        iCash: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        iPointBase: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        iCashBase: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        iRolling : {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
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
            allowNull: false,
            defaultValue: '11110000'
        },
        fHoldemR: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        fBig2R: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        fSitgoR: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        fOmahaR: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        fBaccaratR: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        fSettle:{
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        iParentID:{
            type:Sequelize.INTEGER,
        },
        iClass:{
            type:Sequelize.INTEGER,
        },
        strIP:{
            type:Sequelize.STRING,
        },
        strIPlogin:{
            type:Sequelize.STRING,
        },
        strURL:{
            type:Sequelize.STRING,
        },
        fBreakage:{
            type:Sequelize.FLOAT,
            defaultValue: 0
        },
        createdAt:{
            type:Sequelize.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
            }
        },
        updatedAt:{
            type:Sequelize.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        loginedAt:{
            type:Sequelize.DATE,
            get() {
                return moment(this.getDataValue('loginedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        lastActive:{
            type:Sequelize.DATE
        },
        bLogin:{
            type:Sequelize.INTEGER,
            defaultValue:0
        },
        eLocation:{
            type: Sequelize.ENUM('LOBBY', 'HOLDEM', 'SITGO'),
            defaultValue: 'LOBBY'
        }
    });

    return Users;
}