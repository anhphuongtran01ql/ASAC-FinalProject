import sendMailController from "../controllers/sendMail.controller";

const db = require("../models/index");
const User = db.User;
const Patient = db.Patient;
const Schedule = db.Schedule;
const Appointment = db.Appointment;
const Op = db.Sequelize.Op;
const SUPPORTER_ROLE_ID = 2;
const APPROVE_STATUS = 2;
const sequelize = db.sequelize;

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
  const t = await sequelize.transaction();
  try {
    const patient = await Patient.findByPk(data.patientId);
    let supporter = await User.findByPk(data.userId);
    if (!patient || !supporter) {
      await t.rollback();
      res.status(404).send({
        message: `Not found ${!supporter ? 'Supporter':'Patient' }!`,
      });
    }

    else if (supporter.roleId !== SUPPORTER_ROLE_ID) {
      await t.rollback();
      res.status(400).send({
        message: "User role is not supporter!"
      })
    }
    else {
      await Patient.update({statusId : data.statusId}, {
        where: { id: data.patientId },
      });

      if (data.statusId === APPROVE_STATUS) {
          let query = `select * from schedules where doctorId = ${patient.doctorId} and date = '${patient.dateBooking}'`;
          console.log('query',query)
          const [results] = await sequelize.query(query);
        console.log('patient.dateBooking',results)
        if(results[0].time){
          const dataTransform = JSON.parse(results[0].time)//do update status schedule here
          console.log('dataTransform',dataTransform)
        }
        const appointment = {
          doctorId: patient.doctorId,
          patientId: patient.id,
          date: patient.dateBooking,
          time: patient.timeBooking,
        }
        const existAppointment = await Appointment.findOne({
          where: {
            doctorId:appointment.doctorId,
            patientId:appointment.patientId
          }
        })
        if (!existAppointment) {
          await Appointment.create(appointment)
          await sendMailController.sendMail(patient.email, patient.name);
        }
        await t.commit();
        res.send({message: "update status patient success"})
      }
      else {
        await t.commit();
        res.send({message: "update status patient success!"})
      }
    }
  } catch (err) {
    await t.rollback();
    res.status(500).send({
      message:  err.message || "Some error occurred while update Patient status.",
    });
  }
};

