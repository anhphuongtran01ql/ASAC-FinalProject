import bcrypt from "bcryptjs";
import db from "../models/index";
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const DOCTOR_ROLE_ID = 3;
//generate a salt and hash synchronously - set value for saltRounds is 10
const salt = bcrypt.genSaltSync(10);

let getAllUsers = () => {
  return new Promise((resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
      });
      if (user) {
        resolve(user);
      } else {
        resolve({ status: 404, message: "User not found!" });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = async (req, res, data) => {
  const t = await sequelize.transaction();
  try {
    let password = await hashUserPassword(data.password);
    const user = await db.User.create({
      email: data.email,
      password: password,
      name: data.name,
      lastName: data.lastName,
      address: data.address,
      phone: data.phone,
      gender: data.gender === 1,
      roleId: data.roleId,
    }, { transaction: t });

    if (data.roleId === DOCTOR_ROLE_ID){
      let specialization = await db.Specialization.findByPk(data.specializationId)
      let clinic = await db.Clinic.findByPk(data.clinicId)

      if (!specialization || !clinic) {
        await t.rollback();
        return res.status(404).send({
          message: `Not found ${!clinic ? 'Clinic':'Specialization' }!`,
        });
      }

      const doctorUser = {
        doctorId: user.id,
        clinicId: data.clinicId,
        specializationId: data.specializationId,
      }
      await db.Doctor_User.create(doctorUser, { transaction: t });
      await t.commit();
      return res.send(user)
    }
    else {
      await t.commit();
      res.send(user)
    }
  } catch (err) {
    await t.rollback();
    res.status(500).send({
      message: err.message || "Create doctor err ",
    });
  }
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let editUserInfo = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).send({
        message: "Not found!",
      });
    }
    else {
      await db.User.update(req.body, {
        where: { id: id },
      })
      return res.send({message:"Update success!"})
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Create user err ",
    });
  }
};

let deleteUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: id } });
      if (user) {
        await user.destroy();
        resolve({ message: "User deleted successfully!" });
      } else {
        resolve({ status: 404, message: "User not found!" });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllUsers: getAllUsers,
  getUserDetail: getUserDetail,
  createNewUser: createNewUser,
  editUserInfo: editUserInfo,
  deleteUser: deleteUser,
};
