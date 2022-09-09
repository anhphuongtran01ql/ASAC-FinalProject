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

let createUser = async (req, res) => {
  let data = await userService.createNewUser(req.body);
  return res.send(data);
};

let editUser = async (req, res) => {
  let id = req.query.id;
  let updatedUser = await userService.editUserInfo(id, req.body);
  return res.send(updatedUser);
};

let deleteUser = async (req, res) => {
  let id = req.query.id;
  if (id) {
    let deleteSuccess = await userService.deleteUser(id);
    return res.send(deleteSuccess);
  } else {
    return res.send({ status: 404, message: "User not found!" });
  }
};

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errorCode: 1,
      message: "Invalid email or password!",
    });
  } else {
    let userData = await userService.handleLogin(email, password);

    return res.status(200).json({
      errorCode: userData.errorCode,
      message: userData.message,
      user: userData.user ? userData.user : {},
    });
  }
};

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  createUser: createUser,
  editUser: editUser,
  deleteUser: deleteUser,
  handleLogin: handleLogin,
};
