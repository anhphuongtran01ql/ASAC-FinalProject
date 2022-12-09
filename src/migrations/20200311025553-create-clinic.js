'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Clinics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            introductionHTML: {
                type: Sequelize.TEXT
            },
            introductionMarkdown: {
                type: Sequelize.TEXT
            },
            description: {
                type: Sequelize.TEXT
            },
            equipmentHTML: {
                type: Sequelize.TEXT
            },
            equipmentImg: {
                type: Sequelize.STRING
            },
            locationHTML: {
                type: Sequelize.TEXT
            },
            locationImg: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
            avatar: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Clinics');
    }
};
