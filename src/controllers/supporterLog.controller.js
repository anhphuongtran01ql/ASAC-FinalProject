const db = require("../models/index");
const SupporterLog = db.SupporterLog;
const Op = db.Sequelize.Op;

exports.findAllBySupporterId = (req, res) => {
    const id = req.params.id;
    const content = req.query.content;
    const condition = content ? { content: { [Op.like]: `%${content}%` } } : null;

    SupporterLog.findAll({
        where: condition
            ? { ...condition, supporterId: id }
            : { supporterId: id },
    }).then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Supporter Log.",
            });
        });
};

exports.create = async (req, res) => {
    const data = req.body;

    const supporterLog = {
        supporterId: data.supporterId,
        patientId: data.patientId,
        content: data.content,
    };

    SupporterLog.create(supporterLog)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Supporter Log.",
            });
        });
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        let supporterLog = await SupporterLog.findOne({
            where: { id: id },
        });

        if (!supporterLog) {
            res.status(404).send({
                message: "Not found",
            });
            return;
        }
        res.send(supporterLog);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving SupporterLog with id=" + id,
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    SupporterLog.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num[0] === 1) {
                res.send({
                    message: "SupporterLog was updated successfully.",
                });
            } else {
                res.status(400).send({
                    message: "Not found",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating SupporterLog with id=" + id,
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    SupporterLog.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num === 1) {
                res.send({
                    message: "SupporterLog was deleted successfully!",
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete SupporterLog with id = ${id}. Maybe SupporterLog was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete SupporterLog with id = " + id,
            });
        });
};
