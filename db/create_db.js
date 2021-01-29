var mysql = require("mysql");
const config = require('../config')

var connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  connection.query(`CREATE DATABASE if not exists ${config.database.database}`, function (
    err,
    result
  ) {
    if (err) throw err;
    console.log("Database created");
  });

  connection.end();
});