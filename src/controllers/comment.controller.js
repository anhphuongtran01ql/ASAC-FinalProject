const db = require("../models/index");
const Comment = db.Comment;
const Op = db.Sequelize.Op;

const notFound = (res, name = "") => {
    return res.status(404).send({
        message: `Not found ${name}!` ,
    });
}

exports.findAllCommentByDoctorId = async (req, res) => {
    const doctorId = req.params.id;
    const name = req.query.name;
    const condition = name ? {name: {[Op.like]: `%${name}%`}} : null
    try {
        const doctor = await db.User.findByPk(doctorId);
        if (!doctor || (doctor && doctor.roleId !== 3)) {
           return notFound(res);
        }
        const comment = await Comment.findAll({
            where: condition
                ? {...condition, doctorId: doctorId}
                : {doctorId: doctorId}
        })
        return res.send(comment);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to get patients ",
        });
    }
}

exports.findCommentByDoctorId= async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const appointment = await db.Appointment.findByPk(appointmentId);

        if (!appointment) {
            return notFound(res, "Appointment")
        }
        else {
            const patient = await db.Patient.findByPk(appointment.patientId);
            if (!patient) {
                return notFound(res, "Patient")
            }
            else {
                const comment = await db.Comment.findOne({
                    where : {
                        timeBooking : patient.timeBooking,
                        dateBooking : new Date(patient.dateBooking),
                        name : patient.name,
                        phone: patient.phone,
                        doctorId: req.user.id
                    }
                })
                return res.send(comment ?? {})
            }
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to get patients ",
        });
    }
}