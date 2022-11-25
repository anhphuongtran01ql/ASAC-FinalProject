const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index");
const User = db.User;
const cache = require('../utils/cache');

let verifyToken = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    try {
        token = token.trim();
        const isBlackListed = await cache.get(token);
        if (isBlackListed) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            req.user = decoded;
            req.token = token;
            next();
        });
    } catch (err) {
        return res.status(401).send({message: 'Unauthorized'});
    }

};

let isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });
    });
};
const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
};
module.exports = authJwt;