const db = require("../models/index");
const Schedule = db.Schedule;
const Patient = db.Patient;
const User = db.User;
const Comment = db.Comment;
const Appointment = db.Appointment;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const SUCCESS_STATUS = 2;
const DONE_STATUS = 4;

exports.getDoctorScheduleByDay = (req, res) => {
    const query = req.query;
    let condition = {};
    if (query.doctorId && query.date) {
        condition = {date: new Date(query.date), doctorId: query.doctorId};
        Schedule.findOne({where: condition})
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Schedule.",
                });
            });
    } else {
        res.status(400).send({
            message: "doctorId and date params are required!"
        })
    }
};

exports.getDoctorAppointmentByDay = (req, res) => {
    const query = req.query;
    let condition = {};
    if (query.doctorId && query.date) {
        condition = {date: new Date(query.date), doctorId: query.doctorId};
        Appointment.findAll({where: condition})
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Appointment.",
                });
            });
    } else {
        res.status(400).send({
            message: "doctorId and date params are required!"
        })
    }
};

exports.getAllPatientByDoctorId = async (req, res) => {
    const doctorId = req.params.id;
    try {
        let query = "SELECT p.*, c.id as commentId " +
            "from patients p JOIN comments c ON p.doctorId = c.doctorId " +
            "WHERE p.dateBooking = c.dateBooking " +
            "and p.timeBooking = c.timeBooking " +
            "and p.phone = c.phone " +
            "and p.name = c.name " +
            "and p.statusId in (2,4)" +
            "and p.doctorId = " + doctorId;
        const [results] = await sequelize.query(query);
        res.send(results);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to get doctors ",
        });
    }
};

exports.getDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const doctor = await User.findByPk(doctorId);
        if (!doctor) {
            res.status(404).send({
                message: "Not found",
            });
            return;
        }
        const [results, metadata] = await sequelize.query(
            "select u.*,s.id as specializationId, s.name as specializationName, c.name as clinicName, c.address as clinicAddress from users u " +
            "JOIN doctor_users du on u.id = du.doctorId " +
            "JOIN specializations s on du.specializationId = s.id " +
            "JOIN clinics c on c.id = du.clinicId " +
            "where u.id = :id",
            {
                replacements: {id: doctorId},
            }
        );

        res.send(results[0]);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to get doctors ",
        });
    }
};

exports.editComment = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).send({
                message: "Not found",
            });
        }
        else {
            await Comment.update(data, {
                where: { id: id },
            })
            res.send({message:"Update success!"})
        }
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Property.",
        });
    }
};
