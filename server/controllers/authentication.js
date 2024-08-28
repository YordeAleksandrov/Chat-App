const express = require('express')
require('dotenv').config({ path: './key.env' });
const jwt = require('jsonwebtoken');

const { db } = require('../database/db')
const bcrypt = require('bcrypt');
const route = express.Router()
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;


//REGISTER
exports.register = async (req, res) => {

  const data = req.body;
  console.log(data)
  try {

    const password = await bcrypt.hash(req.body.password, saltRounds);
    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [data.email]);

    if (checkUser.rowCount > 0) {
      console.log('email already registered! ')
      return res.status(400).json({ message: 'Email is already registered' });
    }

    await db.query('INSERT INTO users(user_id, username, email, password,status) VALUES($1, $2, $3, $4,$5)', [data.id, data.name, data.email, password, 'online']);
    const accessToken = jwt.sign({ id: data.id, date: new Date() }, secretKey, { expiresIn: '30min' });
    const refreshToken = jwt.sign(data, secretKey, { expiresIn: '1d' });
    res.cookie('refreshToken', `${refreshToken}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
    });
    res.header({
      'Access-Control-Expose-Headers': 'Authorization',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    });
    res.json({
      user: {
        name: data.name,
        email: data.email,
        id: data.id
      }
    });
    console.log('user successfully registered!')
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};



//LOGIN
exports.login = async (req, res) => {

  const { email, password } = req.body
  try {

    const data = await db.query('SELECT * FROM users WHERE email=$1', [email])
    if (data.rowCount === 0) return res.sendStatus(404)
    const receivedData = data.rows[0]
    const match = bcrypt.compare(password, receivedData.password)
    if (!match) return res.sendStatus(404)
    const accessToken = jwt.sign({ id: receivedData.user_id, date: new Date() }, secretKey, { expiresIn: '30min' });
    const refreshToken = jwt.sign(receivedData, secretKey, { expiresIn: '1d' });


    res.cookie('refreshToken', `${refreshToken}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
    });
    res.header({
      'Access-Control-Expose-Headers': 'Authorization',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    });
    res.status(200).json({ name: receivedData.username, email: receivedData.email, id: receivedData.user_id })
  } catch (error) {
    res.status(500).send('invalid data')
    console.log(error)
  }
}
