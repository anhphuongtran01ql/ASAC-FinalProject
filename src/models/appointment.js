'use strict';
module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.DATE,
        time: DataTypes.TIME,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {});
    Appointment.associate = function(models) {
        models.Appointment.belongsTo(models.Patient, { foreignKey: 'id' });
    };
    return Appointment;
};