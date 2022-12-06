//controllers/property.controller.js
const db = require("../models/index");
const Clinic = db.Clinic;
const Specialization = db.Specialization;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
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
        introductionHTML: req.body.introductionHTML,
        description: req.body.description,
        equipmentHTML: req.body.equipmentHTML,
        avatar:req.body.avatar,
        equipmentImg:req.body.equipmentImg,
        locationHTML: req.body.locationHTML,
        locationImg:req.body.locationImg,
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
    const condition = name ? {name: {[Op.like]: `%${name}%`}} : null;

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
            else {
                res.status(404).send({
                    message: "Not found"
                });
            }
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

exports.findAllDoctorByClinicId = async (req, res) => {
    const id = req.params.id;
    const specializationId = req.params.specializationId;
    const name = req.query.name;
    try {
        const clinic = await Clinic.findByPk(id)
        const specialization = await Specialization.findByPk(specializationId);
        if (!clinic || !specialization) {
            res.status(404).send({
                message: `Not found ${!specialization ? 'Specialization':'Clinic' }!`,
            });
            return;
        }

        let query ="select u.*, c.id as clinicId, s.id as specializationId from users u\n" +
            "JOIN doctor_users du on u.id = du.doctorId\n" +
            "JOIN clinics c on c.id = du.clinicId\n" +
            "JOIN specializations s ON s.id = du.specializationId \n" +
            "WHERE c.id = :id AND s.id = :specializationId ";
        if(name) {
            query +=`and u.name LIKE '%${name}%'`;
        }
        const [results, metadata] = await sequelize.query(
            query,
            {
                replacements: { id : id, specializationId : specializationId },
            }
        );

        res.send({data : results});
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to get doctors ",
        });
    }
};

exports.findAllSpecializationsByClinicId = async (req, res) => {
    const id = req.params.id;
    const name = req.query.name;
    try {
        const clinic = await Clinic.findByPk(id)
        if (!clinic) {
            res.status(404).send({
                message: "Not found Clinic!",
            });
            return;
        }

        let query ="SELECT DISTINCT(c.id), s.*, c.id as clinicId from specializations s " +
            "JOIN doctor_users du on s.id = du.specializationId " +
            "JOIN clinics c on c.id = du.clinicId " +
            "WHERE c.id = :id ";
        if(name) {
            query +=`and s.name LIKE '%${name}%'`;
        }
        const [results, metadata] = await sequelize.query(
            query,
            {
                replacements: { id : id },
            }
        );

        res.send(results);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to get specializations ",
        });
    }
};
