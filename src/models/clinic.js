'use strict';
module.exports = (sequelize, DataTypes) => {
    const Clinic = sequelize.define('Clinic', {
        name: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        introductionHTML: DataTypes.TEXT,
        introductionMarkdown: DataTypes.TEXT,
        description: DataTypes.TEXT,
        image: DataTypes.STRING,
        avatar: DataTypes.STRING,
        equipmentHTML: DataTypes.TEXT,
        equipmentImg:DataTypes.STRING,
        locationHTML: DataTypes.TEXT,
        locationImg:DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {});
    Clinic.associate = function(models) {
        models.Clinic.hasOne(models.Post, { foreignKey: 'forClinicId' });
    };
    return Clinic;
};
