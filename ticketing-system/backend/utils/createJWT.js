const jwt = require("jsonwebtoken");

function createJWT(user, secretKey, expire) {
    return jwt.sign(
        { ...user },
        secretKey,
        { expiresIn: expire }
    )
}

module.exports = createJWT;