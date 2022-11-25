import express from "express";
import userController from "../controllers/userController";
import { verifySignUp } from "../middleware";
import authController from "../controllers/auth.controller";
import clinicController from "../controllers/clinic.controller";
import specializationController from "../controllers/specialization.controller";
import supporterController from "../controllers/supporter.controller";
import postController from "../controllers/post.controller";

const { authJwt } = require("../middleware");

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/users", userController.getUsers);
  router.post("/create-user", userController.createUser);
  router.put("/edit-user", userController.editUser);
  router.get("/delete-user", userController.deleteUser);
  router.post(
    "/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    authController.signup
  );
  router.post("/auth/login", authController.login);
  router.get("/user", [authJwt.verifyToken], authController.getUser);
  router.get("/logout", [authJwt.verifyToken], authController.logout);

  router.get("/clinics", [authJwt.verifyToken], clinicController.findAll);
  router.get("/clinics/:id", [authJwt.verifyToken], clinicController.findOne);
  router.put("/clinics/:id", [authJwt.verifyToken], clinicController.update);
  router.delete("/clinics/:id", [authJwt.verifyToken], clinicController.delete);
  router.post("/clinic", [authJwt.verifyToken], clinicController.create);

  router.get(
    "/specializations",
    [authJwt.verifyToken],
    specializationController.findAll
  );
  router.get(
    "/specializations/:id",
    [authJwt.verifyToken],
    specializationController.findOne
  );
  router.delete(
    "/specializations/:id",
    [authJwt.verifyToken],
    specializationController.delete
  );
  router.post(
    "/specialization",
    [authJwt.verifyToken],
    specializationController.create
  );

  router.get("/supporters", [authJwt.verifyToken], supporterController.findAll);

  router.get("/posts/:id", [authJwt.verifyToken], postController.findOne);
  router.delete("/posts/:id", [authJwt.verifyToken], postController.delete);
  router.post("/post", [authJwt.verifyToken], postController.create);
  router.put("/posts/:id", [authJwt.verifyToken], postController.update);

  return app.use("/", router);
};

module.exports = initWebRoutes;
