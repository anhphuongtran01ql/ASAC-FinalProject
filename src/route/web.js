import express from "express";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/users", userController.getUsers);
  router.post("/post-user", userController.postUser);

  return app.use("/", router);
};

module.exports = initWebRoutes;