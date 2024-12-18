const jwt = require('jsonwebtoken');
const crypto = require('crypto');

require('dotenv').config()

function generateRandomString(len) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters[randomIndex];
    }
    return randomId;
}

function generateOTP() {
    const numbers = '0123456789';
    let random = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        random += numbers[randomIndex];
    }
    return random;
}

function generateID(){
    return generateRandomString(5);
}

function generateToken(payload) {
    // const payload = { userId, createdAt: Date.now() };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '2h'});
    return token;
}

module.exports = {generateID, generateOTP, generateToken};
