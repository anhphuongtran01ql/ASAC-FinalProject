//controllers/property.controller.js
const db = require("../models/index");
const Patient = db.Patient;
const User = db.User;
const Status = db.Status;
const Appointment = db.Appointment;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const DEFAULT_STATUS_ID = 1;

exports.findAll = async (req, res) => {
    const name = req.query.name;
    try {
        let query = "select p.*,u.name as doctorName, s.name as statusName from patients p join users u on p.doctorId=u.id join statuses s on s.id = p.statusId where u.roleId = 3 ";
        if (name) {
            query += `and p.name LIKE '%${name}%'`;
        }
        const [results, metadata] = await sequelize.query(query);
        res.send({data: results});
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to get patients ",
        });
    }
};

exports.create = async (req, res) => {
    const data = req.body;

    const patient = {
        doctorId: data.doctorId,
        statusId: DEFAULT_STATUS_ID,
        name: data.name,
        phone: data.phone,
        dateBooking: data.dateBooking,
        timeBooking: data.timeBooking,
        email: data.email,
        gender: data.gender,
        year: data.year,
        address: data.address,
        clinicAddress: data.clinicAddress,
        description: data.description,
        isSentForms:data.isSentForms,
        isTakeCare: data.isTakeCare,
    };

    Patient.create(patient)
        .then((patientData) => {
            res.send(patientData);
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
        const doctor = await User.findByPk(patient.doctorId);
        const status = await Status.findByPk(patient.statusId);
        res.send({...patient.dataValues, doctorName:doctor.name ?? "",statusName:status.name ?? ""});
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving patient with id = " + id,
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
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
