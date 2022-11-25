//controllers/property.controller.js
const db = require("../models/index");
const User = db.User;
const Op = db.Sequelize.Op;
const SUPPORTER_ROLE_ID = 2;
// Retrieve all clinics from the database.
//additional
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
