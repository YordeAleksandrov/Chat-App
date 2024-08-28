const express = require('express')
require('dotenv').config({ path: './key.env' });
const route = express.Router()
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

route.get('/', (req, res) => {
    const refreshToken = req.cookies.refreshToken
    jwt.verify(refreshToken, secretKey, (err, user) => {
        if (err) return res.sendStatus(401)
        const accessToken = jwt.sign({
            payload: {
                name: user.name,
                id: user.id,
                time: new Date()
            }
        }, secretKey,{expiresIn:'15m'});

        res.status(200).json(accessToken)
        console.log('Token Refreshed')
    })


})

module.exports = route