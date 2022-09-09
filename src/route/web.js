import express from "express";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/users", userController.getUsers);
  router.get("/user", userController.getUser);
  router.post("/create-user", userController.createUser);
  router.put("/edit-user", userController.editUser);

  return app.use("/", router);
};

module.exports = initWebRoutes;