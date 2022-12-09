import sendMailController, {sendMail} from "../controllers/sendMail.controller";

const db = require("../models/index");
const User = db.User;
const Patient = db.Patient;
const Schedule = db.Schedule;
const Appointment = db.Appointment;
const Comment = db.Comment;
const Op = db.Sequelize.Op;
const SUPPORTER_ROLE_ID = 2;
const APPROVE_STATUS = 2;
const sequelize = db.sequelize;
const SUCCESS = "success";
const REJECT = "reject";

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
        const schedule = await Schedule.findOne({
          where: {
            doctorId: patient.doctorId,
            date: new Date(patient.dateBooking)
          }
        })
        if (schedule && schedule.time) {
          let newTime = JSON.parse(schedule.time)//do update status schedule here
          newTime = newTime.map((item) => {
            return item.time === patient.timeBooking ? {...item, status: 1} : item
          })
          await schedule.update({time: JSON.stringify(newTime)});
        }

        //create new appointment
        const appointment = {
          doctorId: patient.doctorId,
          patientId: patient.id,
          date: patient.dateBooking,
          time: patient.timeBooking,
        }
        const existAppointment = await Appointment.findOne({
          where: {
            doctorId: appointment.doctorId,
            patientId: appointment.patientId
          }
        })
        if (!existAppointment) {
          //create new Comment
          const comment = {
            doctorId: patient.doctorId,
            dateBooking: patient.dateBooking,
            timeBooking: patient.timeBooking,
            name: patient.name,
            phone: patient.phone
          }

          await Comment.create(comment)
          await Appointment.create(appointment);
          const doctor = await User.findByPk(patient.doctorId);
          await sendMailController.sendMail(patient.email, SUCCESS, patient.name, doctor.name, patient.dateBooking, patient.timeBooking, patient.clinicAddress);

          const duplicateBookings = await Patient.findAll({
            where: {
              doctorId: patient.doctorId,
              statusId: {
                [Op.notIn]: [2]
              },
              dateBooking: new Date(patient.dateBooking),
              timeBooking: patient.timeBooking
            }
          })

          if (duplicateBookings.length > 0) {
            for (const rejectPatient of duplicateBookings) {
              await rejectPatient.update({statusId:REJECT_STATUS})
              await sendMailController.sendMail(rejectPatient.email, REJECT, rejectPatient.name)
            }
          }
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

