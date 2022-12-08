const db = require("../models/index");
const Comment = db.Comment;
const Op = db.Sequelize.Op;

exports.findAllCommentByDoctorId = async (req, res) => {
    const doctorId = req.params.id;
    const name = req.query.name;
    const condition = name ? {name: {[Op.like]: `%${name}%`}} : null
    try {
        const doctor = await db.User.findByPk(doctorId);
        if (doctor && doctor.roleId !== 3) {
           return res.status(404).send({
                message: "Not found",
            });
        }
        const comment = await Comment.findAll({
            where: condition
                ? {...condition, doctorId: doctorId}
                : {doctorId: doctorId}
        })
        return res.send(comment);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error to get patients ",
        });
    }
};