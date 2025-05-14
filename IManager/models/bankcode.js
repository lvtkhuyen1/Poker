let moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Banks = sequelize.define("Banks", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        iBankCode: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        strBankName: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        eState: {
            type:DataTypes.ENUM('ENABLE', 'DISABLE'),
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

    return Banks;
};