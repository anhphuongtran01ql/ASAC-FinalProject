import db from "../models/index";
import userService from "../services/userService";

let getUsers = async (req, res) => {
  let data = await userService.getAllUsers();
  return res.send(data);
};

let postUser = async (req, res) => {
  let data = await userService.createNewUser(req.body);
  return res.send(data);
};

module.exports = {
  getUsers: getUsers,
  postUser: postUser,
};
