'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@admin.com',
      password: 'password',
      firstName: 'Phuong',
      lastName: 'Tran',
      address: 'Vietname',
      phoneNumber: '123-456-7890',
      gender: 1,
      image: 'http://localhost',
      roleId: 'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
