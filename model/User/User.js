const DB = require("../db");

async function followAdmin(client, followDetails) {
 
  return new Promise(function (resolve, reject) {
    client.query(`INSERT INTO followers (userid, followerid) VALUES (${followDetails.userID}, ${followDetails.adminID})`,
      function (error, result) {
        if (error) {
          console.log("Error is", error)
          reject(error);
          return;
        }
        resolve(result);
      })
  })
}

async function updateProfileByID(client, userDetails) {
  return new Promise(function (resolve, reject) {
    client.query(`UPDATE users SET imageURL = "${userDetails.file}", name = "${userDetails.name}", password = "${userDetails.password}" WHERE id = ${userDetails.userID}`,
      function (error, result) {
        if (error) {
          console.log("Error is", error)
          reject(error);
          return;
        }
        resolve(result);
      })
  })
}

async function getProfileByID(client, userID) {
  console.log(userID)
  return new Promise(function (resolve, reject) {
    //return client.query(`SELECT * from users as u JOIN userDetails as ud WHERE u.id = ud.id AND u.id = ${userID}`, function (error, result, fields) {
      return client.query(`SELECT * from users  WHERE id = ${userID}`, function (error, result, fields) {
     
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function getFollowedAdminsByID(client, userID) {
  console.log(userID)
  return new Promise(function (resolve, reject) {
    return client.query(`SELECT * from followers as f JOIN users as u WHERE f.followerid = u.id AND f.userid = ${userID}`, function (error, result, fields) {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function searchQuery(client, keyword) {
  console.log("ssss",keyword[0])
  return new Promise(function (resolve, reject) {
      return client.query(`SELECT * from songs where name REGEXP '^(${keyword[0]}|${keyword[1]}|${keyword[2]})' `, function (error, result, fields) {
          if (error) {
              reject(error);
              return;
          }
          resolve(result);
      });
  });
}


async function updateadminFollowCount(client, adminId,followerCount) {
  return new Promise(function (resolve, reject) {
      client.query(`UPDATE users SET noOfFollower = ${followerCount}  WHERE id = ${adminId}`,
          function (error, result) {
              if (error) {
                  console.log("Error is", error)
                  reject(error);
                  return;
              }
              resolve(result);
          })
  })
}

module.exports = {
  updateProfileByID: updateProfileByID,
  getProfileByID: getProfileByID,
  followAdmin: followAdmin,
  updateadminFollowCount:updateadminFollowCount,
  getFollowedAdminsByID: getFollowedAdminsByID,
  searchQuery: searchQuery
};