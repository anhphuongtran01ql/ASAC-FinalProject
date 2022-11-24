import express from "express";
import userController from "../controllers/userController";
import {verifySignUp} from "../middleware";
import authController from "../controllers/auth.controller";
const { authJwt } = require("../middleware");

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/users", userController.getUsers);
  router.post("/create-user", userController.createUser);
  router.put("/edit-user", userController.editUser);
  router.get("/delete-user", userController.deleteUser);
  router.post("/auth/signup",[verifySignUp.checkDuplicateUsernameOrEmail], authController.signup);
  router.post("/auth/login", authController.login);
  router.get("/user", [authJwt.verifyToken], authController.getUser);
  router.get('/logout', [authJwt.verifyToken], authController.logout);

  return app.use("/", router);
};

module.exports = initWebRoutes;
