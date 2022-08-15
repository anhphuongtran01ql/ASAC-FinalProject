import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/getUsers", homeController.getUsers);

  return app.use("/", router);
};

module.exports = initWebRoutes;