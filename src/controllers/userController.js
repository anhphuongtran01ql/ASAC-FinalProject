import db from "../models/index";
import userService from "../services/userService";

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

let postUser = async (req, res) => {
  let data = await userService.createNewUser(req.body);
  return res.send(data);
};

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  postUser: postUser,
};
