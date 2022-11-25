//controllers/property.controller.js
const db = require("../models/index");
const Specialization = db.Specialization;
const Op = db.Sequelize.Op;

// Create and Save a new Property
exports.create = async (req, res) => {
  const data = req.body;

  // Validate request
  if (!data.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  let ExistSpecialization = await Specialization.findOne({
    where: { name: data.name },
  });

  if (ExistSpecialization) {
    res.status(400).send({
      message: "Name already exists",
    });
    return;
  }

  // Create a clinic
  const specialization = {
    name: data.name,
    description: data.description,
    image: data.image,
  };
  // Save Property in the database
  Specialization.create(specialization)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Property.",
      });
    });
};

// Retrieve all clinics from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  const condition = name ? { title: { [Op.like]: `%${name}%` } } : null;

  Specialization.findAll({ where: condition })
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

// Find a single Property with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    let specialization = await Specialization.findOne({
      where: { id: id },
    });
    if (!specialization) {
      res.status(404).send({
        message: "Not found",
      });
      return;
    }
    res.send(specialization);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Property with id=" + id,
    });
  }
};

// Update a Property by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  Specialization.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      res.send({
        message: "Specialization was updated successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Property with id=" + id,
      });
    });
};

// Delete a Property with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Specialization.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: "Specialization was deleted successfully!",
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Property with id=${id}. Maybe Property was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Property with id=" + id,
      });
    });
};
