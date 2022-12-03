'use strict';
module.exports = (sequelize, DataTypes) => {
    const Specialization = sequelize.define('Specialization', {
        name: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        image: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {});
    Specialization.associate = function(models) {
        models.Specialization.hasOne(models.Post, { foreignKey: 'forSpecializationId' });
    };
    return Specialization;
};
