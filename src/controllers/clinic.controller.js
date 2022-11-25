//controllers/property.controller.js
const db = require("../models/index");
const Clinic = db.Clinic;
const Op = db.Sequelize.Op;

// Create and Save a new Property
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Name can not be empty!"
        });
        return;
    }

    // Create a clinic
    const clinic = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        // introductionHTML: req.body.introductionHTML,
        // introductionMarkdown: req.body.introductionMarkdown,
        description: req.body.description,
        image: req.body.image,
    };
    // Save Property in the database
    Clinic.create(clinic)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Property."
            });
        });
};

// Retrieve all clinics from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    const condition = name ? {title: {[Op.like]: `%${name}%`}} : null;

    Clinic.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Clinic."
            });
        });
};

// Find a single Property with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Clinic.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            }
            res.status(404).send({
                message: "Not found"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Property with id=" + id
            });
        });
};

// Update a Property by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    Clinic.update(req.body, {
        where: {id: id}
    })
        .then(num => {
            res.send({
                message: "Clinic was updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Property with id=" + id
            });
        });
};

// Delete a Property with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Clinic.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Clinic was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Property with id=${id}. Maybe Property was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Property with id=" + id
            });
        });
};

// Delete all Propertys from the database.
exports.deleteAll = (req, res) => {
    Property.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} Properties were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all properties."
            });
        });
};
