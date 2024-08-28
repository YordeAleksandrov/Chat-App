const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'Messenger-App', 
  password: 'T1234567', 
  port: 5432, 
});
const db=pool
module.exports = {db};