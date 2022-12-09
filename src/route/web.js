import express from "express";
import userController from "../controllers/userController";
import { verifySignUp } from "../middleware";
import authController from "../controllers/auth.controller";
import clinicController from "../controllers/clinic.controller";
import specializationController from "../controllers/specialization.controller";
import supporterController from "../controllers/supporter.controller";
import postController from "../controllers/post.controller";
import scheduleController from "../controllers/schedule.controller";
import supporterLogController from "../controllers/supporterLog.controller";
import patientController from "../controllers/patient.controller";
import doctorController from "../controllers/doctor.controller";
import commentController from "../controllers/comment.controller";

const { authJwt } = require("../middleware");

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/users", userController.getUsers); // not use
  router.get("/doctors",
      // [authJwt.verifyToken],
      userController.getAllDoctors);
  router.post("/user",
      [authJwt.verifyToken, verifySignUp.checkDuplicateUsernameOrEmail],
      userController.createUser);
  router.put("/users/:id", [authJwt.verifyToken], userController.editUser);
  router.delete("/users/:id",
      // [authJwt.verifyToken],
      userController.deleteUser);
  router.post(
    "/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    authController.signup
  );
  router.post("/auth/login", authController.login);
  router.get("/info", [authJwt.verifyToken], authController.getUser);
  router.get("/logout", [authJwt.verifyToken], authController.logout);

  router.get("/clinics",
      // [authJwt.verifyToken],
      clinicController.findAll);
  router.get("/clinics/:id",
      // [authJwt.verifyToken],
      clinicController.findOne);
  router.put("/clinics/:id", [authJwt.verifyToken], clinicController.update);
  router.delete("/clinics/:id", [authJwt.verifyToken], clinicController.delete);
  router.post("/clinic", [authJwt.verifyToken], clinicController.create);
  router.get("/clinics/:id/specializations/:specializationId",
      // [authJwt.verifyToken],
      clinicController.findAllDoctorByClinicId);
  router.get("/clinics/:id/specializations",
      // [authJwt.verifyToken],
      clinicController.findAllSpecializationsByClinicId);

  router.get(
    "/specializations",
    // [authJwt.verifyToken],
    specializationController.findAll
  );
  router.get(
    "/specializations/:id",
    // [authJwt.verifyToken],
    specializationController.findOne
  );
  router.get(
    "/doctors/specializations/:id",
    // [authJwt.verifyToken],
    specializationController.getDoctorBySpecializationId
  );
  router.delete(
    "/specializations/:id",
    // [authJwt.verifyToken],
    specializationController.delete
  );
  router.post(
    "/specialization",
    // [authJwt.verifyToken],
    specializationController.create
  );
  router.put(
    "/specialization/:id",
    // [authJwt.verifyToken],
    specializationController.update
  );

  router.get("/supporters",
      // [authJwt.verifyToken],
      supporterController.findAll);
  router.post("/supporters/update-status-patient",
      // [authJwt.verifyToken],
      supporterController.updateStatusPatient);

  router.get("/posts/:id", [authJwt.verifyToken], postController.findOne);
  router.delete("/posts/:id", [authJwt.verifyToken], postController.delete);
  router.post("/post", [authJwt.verifyToken], postController.create);
  router.put("/posts/:id", [authJwt.verifyToken], postController.update);

  router.get("/schedules", [authJwt.verifyToken], scheduleController.findAll);
  router.get("/schedules/:id", [authJwt.verifyToken], scheduleController.findOne);
  router.post("/schedule", [authJwt.verifyToken], scheduleController.create);
  router.put("/schedules/:id", [authJwt.verifyToken], scheduleController.update);
  router.delete("/schedules/:id", [authJwt.verifyToken], scheduleController.delete);

  router.get("/supporter-logs/supporter/:id", [authJwt.verifyToken], supporterLogController.findAllBySupporterId);
  router.get("/supporter-logs/:id", [authJwt.verifyToken], supporterLogController.findOne);
  router.post("/supporter-log", [authJwt.verifyToken], supporterLogController.create);
  router.put("/supporter-logs/:id", [authJwt.verifyToken], supporterLogController.update);
  router.delete("/supporter-logs/:id", [authJwt.verifyToken], supporterLogController.delete);

  router.get("/patients",
      // [authJwt.verifyToken],
      patientController.findAll);
  router.get("/patients/:id",
      // [authJwt.verifyToken],
      patientController.findOne);
  router.post("/patient",
      // [authJwt.verifyToken],
      patientController.create);
  router.put("/patients/:id", [authJwt.verifyToken], patientController.update);
  router.delete("/patients/:id", [authJwt.verifyToken], patientController.delete);

  router.get("/schedule-of-doctors-by-date",
      // [authJwt.verifyToken],
      doctorController.getDoctorScheduleByDay);
  router.get("/appointment-of-doctors-by-date",
      // [authJwt.verifyToken],
      doctorController.getDoctorAppointmentByDay);
  router.get("/patients-by-doctor-id/:id", [authJwt.verifyToken], doctorController.getAllPatientByDoctorId);
  router.get("/doctors/:id", doctorController.getDoctorById);
  router.get("/doctor/:id/comments", [authJwt.verifyToken], commentController.findAllCommentByDoctorId);
  router.get("/appointments/:id/comment", [authJwt.verifyToken], commentController.findCommentByDoctorId);
  router.put("/appointments/comments/:id", [authJwt.verifyToken], doctorController.editComment);

  return app.use("/", router);
};

module.exports = initWebRoutes;
