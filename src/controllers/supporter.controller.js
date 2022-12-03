import sendMailController from "../controllers/sendMail.controller";

const db = require("../models/index");
const User = db.User;
const Patient = db.Patient;
const Appointment = db.Appointment;
const Op = db.Sequelize.Op;
const SUPPORTER_ROLE_ID = 2;

exports.findAll = (req, res) => {
  const name = req.query.name;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  User.findAll({
    where: condition
      ? { ...condition, roleId: SUPPORTER_ROLE_ID }
      : { roleId: SUPPORTER_ROLE_ID },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Specialization.",
      });
    });
};

exports.updateStatusPatient = async (req, res) => {
  const data = req.body;
  try {
    const patient = await Patient.findByPk(data.patientId);
    let supporter = await User.findByPk(data.userId);
    if (!patient || !supporter) {
      res.status(404).send({
        message: `Not found ${!supporter ? 'Supporter':'Patient' }!`,
      });
    }

    else if (supporter.roleId !== SUPPORTER_ROLE_ID) {
      res.status(400).send({
        message: "User role is not supporter!"
      })
    }
    else {
    await Patient.update({statusId : data.statusId}, {
      where: { id: data.patientId },
    });
    const appointment = {
      doctorId: patient.doctorId,
      patientId: patient.id,
      date: patient.dateBooking,
      time: patient.timeBooking,
    }
    const existAppointMent = await Appointment.findOne({
      where: {
        doctorId:appointment.doctorId,
        patientId:appointment.patientId
      }
    })
      if(!existAppointMent){
        await Appointment.create(appointment);
        await sendMailController.sendMail(supporter.email, supporter.name);
      }
      res.send({message: "update status patient success"})
    }
  } catch (err) {
    res.status(500).send({
      message:  err.message || "Some error occurred while update Patient status.",
    });
  }

};

