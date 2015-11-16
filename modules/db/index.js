var config = requireMain('./config');
var mysql = require('mysql');

module.exports = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});
