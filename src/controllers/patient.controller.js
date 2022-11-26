//controllers/property.controller.js
const db = require("../models/index");
const Patient = db.Patient;
const Appointment = db.Appointment;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    Patient.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Patient.",
            });
        });
};

exports.create = async (req, res) => {
    const data = req.body;

    const patient = {
        doctorId: data.doctorId,
        statusId: data.statusId,
        name: data.name,
        phone: data.phone,
        dateBooking: data.dateBooking,
        timeBooking: data.timeBooking,
        email: data.email,
        gender: data.gender,
        year: data.year,
        address: data.address,
        description: data.description,
        isSentForms:data.isSentForms,
        isTakeCare: data.isTakeCare,
    };

    Patient.create(patient)
        .then((patientData) => {
            console.log('patient data', patientData)
            const appointment = {
                doctorId: data.doctorId,
                patientId: patientData.id,
                date: data.dateBooking,
                time: data.timeBooking,
            }
            Appointment.create(appointment)
                .then((appointmentData) => {
                    res.send(patientData);
                })
                .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the appointment.",
                });
            })
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Property.",
            });
        });
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        let patient = await Patient.findOne({
            where: { id: id },
        });

        if (!patient) {
            res.status(404).send({
                message: "Not found",
            });
            return;
        }
        res.send(patient);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving patient with id = " + id,
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    console.log('id',id)
    Patient.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num[0] === 1) {
                res.send({
                    message: "Patient was updated successfully.",
                });
            } else {
                res.status(400).send({
                    message: "Not found",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Patient with id = " + id,
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Patient.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num === 1) {
                res.send({
                    message: "Patient was deleted successfully!",
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Patient with id = ${id}. Maybe Patient was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Patient with id = " + id,
            });
        });
};
