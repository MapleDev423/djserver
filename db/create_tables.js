var mysql = require("mysql");
const config = require('../config')

var con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  var sql =
    "CREATE TABLE if not exists users (id INT AUTO_INCREMENT, name VARCHAR(50) not null, imageUrl VARCHAR(255), userType VARCHAR(20) not null, email varchar(50) NOT NULL, username varchar(50) NOT NULL, password varchar(255) NOT NULL, token varchar(255) NOT NULL, active BOOL ,forget BOOL, block BOOL,noOfFollower INT DEFAULT 0, adminAccess BOOL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id), UNIQUE KEY (email), UNIQUE KEY (username))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created - Users");
  });

  var sql =
    "CREATE TABLE if not exists followers (id INT AUTO_INCREMENT, userid INT not null, followerid INT not null, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id), FOREIGN KEY (userid) REFERENCES users(id), FOREIGN KEY (followerid) REFERENCES users(id))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created - Followers");
  });

  var sql =
    "CREATE TABLE if not exists playlist (id INT AUTO_INCREMENT, title VARCHAR(50) not null, image VARCHAR(255) not null,description VARCHAR(255) not null, views INT DEFAULT 0,noOfFavorite INT DEFAULT 0, playlistOwner INT not null,added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id), FOREIGN KEY (playlistOwner) REFERENCES users(id))"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created - Playlist");
  });

  var sql =
    "CREATE TABLE if not exists songs (id INT AUTO_INCREMENT, name Text not null, path VARCHAR(255) not null, views INT DEFAULT 0, playlistId INT not null, added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id), FOREIGN KEY (playlistID) REFERENCES playlist(id))"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created - Songs");
  });

  var sql =
    "CREATE TABLE if not exists favourites (id INT AUTO_INCREMENT, user INT not null, playlist INT not null, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id), FOREIGN KEY (user) REFERENCES users(id), FOREIGN KEY (playlist) REFERENCES playlist(id))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created - Favourite");
  });

  var sql =
    "CREATE TABLE if not exists biography (id INT AUTO_INCREMENT, user INT not null, bio text, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id), FOREIGN KEY (user) REFERENCES users(id))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created - Biography");
  });

  var sql =
    "CREATE TABLE if not exists notifications (id INT AUTO_INCREMENT, playlistID int not null, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id), FOREIGN KEY (playlistID) REFERENCES playlist(id))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created - Notifications");
  });


  con.end();
});