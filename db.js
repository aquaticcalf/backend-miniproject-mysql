const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'database',
})

module.exports = pool