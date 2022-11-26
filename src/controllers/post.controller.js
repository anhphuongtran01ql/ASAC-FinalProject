//controllers/property.controller.js
const db = require("../models/index");
const Post = db.Post;
const Op = db.Sequelize.Op;

// Create and Save a new Property
exports.create = async (req, res) => {
  const data = req.body;

  // Create a clinic
  const post = {
    title: data.title,
    contentMarkdown: data.contentMarkdown,
    contentHTML: data.contentHTML,
    forDoctorId: data.forDoctorId,
    forSpecializationId: data.forSpecializationId,
    forClinicId: data.forClinicId,
    confirmByDoctor: data.confirmByDoctor,
  };

  // Save Property in the database
  Post.create(post)
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

// Find a single Property with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    let post = await Post.findOne({
      where: { forDoctorId: id },
    });
    
    if (!post) {
      res.status(404).send({
        message: "Not found",
      });
      return;
    }
    res.send(post);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Property with id=" + id,
    });
  }
};

// Update a Property by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  Post.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num[0] === 1) {
        res.send({
          message: "post was updated successfully.",
        });
      } else {
        res.status(400).send({
          message: "Not found",
        });
      }
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

  Post.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: "Post was deleted successfully!",
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
