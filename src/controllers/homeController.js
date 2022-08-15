import db from "../models/index";
import userService from "../services/userService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    console.log(data);
    return res.render("homepage.ejs", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

let getUsers = async (req, res) => {
  return res.render("users.ejs");
};

let postUser = async (req, res) => {
  await userService.createNewUser(req.body);
  return res.send("post new user successful!");
}

module.exports = {
  getHomePage: getHomePage,
  getUsers: getUsers,
  postUser: postUser,
};
