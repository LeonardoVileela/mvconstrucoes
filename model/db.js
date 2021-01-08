const mysql = require('mysql2');

/*const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'funcionario',
  password: ''
});*/

const connection = mysql.createConnection({
  host: 'mysql742.umbler.com',
  user: 'bd-root',
  database: 'funcionario',
  password: 'leo91167213'
});

module.exports = connection