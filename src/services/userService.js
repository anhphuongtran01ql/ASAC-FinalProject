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
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === 1 ? true : false,
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
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.gender = data.gender;

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
        resolve({ status: 200, message: "User deleted successfully!" });
      } else {
        resolve({ status: 404, message: "User not found!" });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email: email } });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);

      if (isExist) {
        let user = await db.User.findOne({
          where: { email: email },
          raw: true,
        });
        if (user) {
          let checkPassword = await bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            userData.errorCode = 0;
            userData.message = "OK!";

            delete user.password;
            userData.user = user;
          } else {
            userData.errorCode = 3;
            userData.message = "Password is incorrect!";
          }
        } else {
          userData.errorCode = 4;
          userData.message = "User does not exist!";
        }
      } else {
        userData.errorCode = 2;
        userData.message = "Email does not exist. Please try again!";
      }
      resolve(userData);
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
  handleLogin: handleLogin,
};
