const jwt = require('jsonwebtoken');
const config = require('./config');

const signToken = (id) => {
    return jwt.sign({ id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, config.jwt.secret);
};

module.exports = {
    signToken,
    verifyToken
};