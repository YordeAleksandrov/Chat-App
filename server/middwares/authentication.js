const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './key.env' });
const SECRET_KEY = process.env.SECRET_KEY


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);
  jwt.verify(JSON.parse(token), SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Token expired')
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
module.exports = authenticateToken