import bcrypt from "bcryptjs";
import db from "../models/index";

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

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let password = await hashUserPassword(data.password);
      let user = await db.User.create({
        email: data.email,
        password: password,
        name: data.name,
        address: data.address,
        phone: data.phone,
        gender: data.gender,
        roleId: data.roleId,
      });
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
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

let editUserInfo = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
      });
      if (user) {
        user.email = data.email;
        user.name = data.name;
        user.address = data.address;
        user.phone = data.phone;
        user.roleId = data.roleId;
        user.gender= data.gender ;
        user.description = data.description;

        let updatedUser = await user.save();
        resolve(updatedUser);
      } else {
        resolve({
          status: 404,
          message: "User not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
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
