const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dbtest', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // disable logging (prevent sequelize from outputting SQL to the console on the execution of queries)
});

let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = connectDB;

