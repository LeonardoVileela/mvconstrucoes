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
  password: 'leo91167213',
  database: 'funcionario'
});

module.exports = connection