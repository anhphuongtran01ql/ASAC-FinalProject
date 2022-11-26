'use strict';
module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        doctorId: DataTypes.INTEGER,
        date: DataTypes.DATE,
        time: DataTypes.TIME,
        maxBooking: DataTypes.STRING,
        sumBooking: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {});
    Schedule.associate = function(models) {
        models.Schedule.belongsTo(models.User, { foreignKey: 'doctorId' });
    };
    return Schedule;
};
