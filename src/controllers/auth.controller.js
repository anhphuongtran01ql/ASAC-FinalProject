const db = require("../models/index");
const config = require("../config/auth.config");
const cache = require('../utils/cache');
const ROLES = db.Role;
const User = db.User;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    // Save User to Database
    await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then(user => {
        res.send(user);
    })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

exports.login = async (req, res) => {
    await User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(async user => {
            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = await jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            const userInfo = await User.findByPk(user.id);
            return res.json({...userInfo.dataValues, access_token: token, token_type: 'Bearer', expires_in: 86400});
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

exports.getUser = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    return res.json(user);
}

exports.logout = async (req, res) => {
    const token = req.token;
    const now = new Date();
    const expire = new Date(req.user.exp);
    const milliseconds = now.getTime() - expire.getTime();
    /* ----------------------------- BlackList Token ---------------------------- */
    await cache.set(token, token, milliseconds);

    return res.json({message: 'Logged out successfully'});
}