const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql742.umbler.com',
  port: 3306,
  user: 'db-root',
  password: 'leo91167213',
  database: 'session'
});

module.exports = connection