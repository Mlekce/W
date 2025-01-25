const jwt = require("jsonwebtoken");

function generateEmailToken(userId, secretKey) {
    const token = jwt.sign({ userId }, secretKey, { expiresIn : '1h' })
    return token;
}

function verifyToken(token, secretKey) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded
    } catch (error) {
        console.error(error);
        return null
    }
}

module.exports = {
    generateEmailToken,
    verifyToken
}