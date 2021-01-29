var mysql = require("mysql");
const config = require("../config")

const connection = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

module.exports = {
  connection: connection
};