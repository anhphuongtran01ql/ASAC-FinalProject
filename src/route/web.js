import express from "express";
import userController from "../controllers/userController";
import {verifySignUp} from "../middleware";
import authController from "../controllers/auth.controller";
import clinicController from "../controllers/clinic.controller";

const {authJwt} = require("../middleware");

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/users", userController.getUsers);
    router.post("/create-user", userController.createUser);
    router.put("/edit-user", userController.editUser);
    router.get("/delete-user", userController.deleteUser);
    router.post("/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail], authController.signup);
    router.post("/auth/login", authController.login);
    router.get("/user", [authJwt.verifyToken], authController.getUser);
    router.get('/logout', [authJwt.verifyToken], authController.logout);

    router.get("/clinics", [authJwt.verifyToken], clinicController.findAll);
    router.get("/clinics/:id", [authJwt.verifyToken], clinicController.findOne);
    router.put("/clinics/:id", [authJwt.verifyToken], clinicController.update);
    router.delete("/clinics/:id", [authJwt.verifyToken], clinicController.delete);
    router.post("/clinic", [authJwt.verifyToken], clinicController.create);

    return app.use("/", router);
};

module.exports = initWebRoutes;
