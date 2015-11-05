var config = requireMain('./config');
var mysql = require('mysql');

var connection = mysql.createConnection(config);
connection.connect();

module.exports = connection;
