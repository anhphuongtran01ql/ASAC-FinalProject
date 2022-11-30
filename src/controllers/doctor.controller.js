const db = require("../models/index");
const Schedule = db.Schedule;
const Patient = db.Patient;
const User = db.User;
const Comment = db.Comment;
const Appointment = db.Appointment;
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

exports.getAllPatientByDoctorId = (req, res) => {
    const doctorId = req.params.id;
    Patient.findAll({
        where: {
            doctorId: doctorId,
            statusId: SUCCESS_STATUS
        }
    })
        .then((data) => {
                res.send(data);
            }
        )
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Schedule.",
            });
        })
};

exports.getDoctorById = (req, res) => {
    const doctorId = req.params.id;
    User.findByPk(doctorId)
        .then((data) => {
                res.send(data);
            }
        )
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Doctor.",
            });
        })
};

exports.createComment = async (req, res) => {
    const data = req.body;
    try {
        let patient = await Patient.findByPk(data.patientId);
        if (!patient) {
            res.status(404).send({
                message: "Not found",
            });
            return;
        }
        const commentData = {
            doctorId: data.doctorId,
            timeBooking: patient.timeBooking,
            dateBooking: patient.dateBooking,
            name: patient.name,
            phone: patient.phone,
            content: data.content,
        };
        const comment = await Comment.create(commentData);
        //write functon send email here
        patient.set({
            statusId: DONE_STATUS
        })
        await patient.save()
        res.send(comment);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Property.",
        });
    }
};
