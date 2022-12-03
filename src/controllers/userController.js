import userService from "../services/userService";

const db = require("../models/index");
const User = db.User;
const Op = db.Sequelize.Op;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const DOCTOR_ROLE_ID = 3;

let getUsers = async (req, res) => {
  let data = await userService.getAllUsers();
  return res.send(data);
};

let getUser = async (req, res) => {
  let id = req.query.id;
  if (id) {
    let data = await userService.getUserDetail(id);
    return res.send(data);
  } else {
    return res.send({ status: 404, message: "User not found!" });
  }
};

let createUser = async (req, res) => {
  let data = await userService.createNewUser(req, res, req.body);
  return res.send(data);
};

let editUser = async (req, res) => {
  let id = req.params.id;
  let updatedUser = await userService.editUserInfo(id, req.body);
  return res.send(updatedUser);
};

let deleteUser = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
      .then((num) => {
        if (num === 1) {
          res.send({
            message: "User was deleted successfully!",
          });
        } else {
          res.status(404).send({
            message: `User not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Property with id=" + id,
        });
      });
};

let getAllDoctors = (req, res) => {
  const name = req.query.name;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  User.findAll({
    where: condition
        ? { ...condition, roleId: DOCTOR_ROLE_ID }
        : { roleId: DOCTOR_ROLE_ID },
  })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || "Some error occurred while retrieving Doctors.",
        });
      });
}

let getAllDoctorsAndSpecialization = async (req, res) => {
  const name = req.query.name;
  try {
    let query = "select u.*, s.name as specialization from users u " +
      "left join doctor_users du on u.id = du.doctorId " +
      "left join specializations s on s.id = du.specializationId " +
      "WHERE u.roleId = :doctorRoleId ";
    if(name) {
      query +=`and u.name LIKE '%${name}%'`;
    }
    const [doctors] = await sequelize.query(
      query,
      {
        replacements: {doctorRoleId: DOCTOR_ROLE_ID},
      }
    );
    res.send(doctors);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Doctors.",
    });
  }
}

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  createUser: createUser,
  editUser: editUser,
  deleteUser: deleteUser,
  getAllDoctors: getAllDoctorsAndSpecialization
};
