const db = require("../models/index");
const User = db.User;
const Patient = db.Patient;
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
    let supporter = await User.findByPk(data.userId);

    if (!supporter) {
      res.status(404).send({
        message: "Not found supporter!",
      });
      return;
    }

    if(supporter.roleId !== SUPPORTER_ROLE_ID) {
      res.status(400).send({
        message: "User role is not supporter!"
      })
      return;
    }

    Patient.update({statusId : data.statusId}, {
      where: { id: data.patientId },
    })
        .then((num) => {
          if (num[0] === 1) {
            res.send({
              message: "Patient was updated successfully.",
            });
          } else {
            res.status(400).send({
              message: "Not found Patient!",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error updating Patient with id = " + data.id,
          });
        });
  } catch (err) {
    res.status(500).send({
      message:  err.message || "Some error occurred while update Patient status.",
    });
  }

};

