//controllers/property.controller.js
const db = require("../models/index");
const Schedule = db.Schedule;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
    try {
        let query = "SELECT s.*,u.name as doctorName from schedules s join users u on u.id = s.doctorId and u.roleId = 3"
        const [results, metadata] = await sequelize.query(query);
        res.send(results);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Schedules.",
        });
    }
};

exports.create = async (req, res) => {
    const data = req.body;

    const schedule = {
        doctorId: data.doctorId,
        date: data.date,
        time: data.time,
        maxBooking: data.maxBooking,
        sumBooking: data.sumBooking,
    };

    Schedule.create(schedule)
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

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        let schedule = await Schedule.findOne({
            where: { id: id },
        });

        if (!schedule) {
            res.status(404).send({
                message: "Not found",
            });
            return;
        }
        res.send(schedule);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Schedule with id=" + id,
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    Schedule.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num[0] === 1) {
                res.send({
                    message: "Schedule was updated successfully.",
                });
            } else {
                res.status(400).send({
                    message: "Not found",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Schedule with id=" + id,
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Schedule.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num === 1) {
                res.send({
                    message: "Schedule was deleted successfully!",
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
