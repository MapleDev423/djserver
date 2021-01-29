const DB = require("../db");

async function updateProfileByID(client, userDetails) {
  return new Promise(function (resolve, reject) {
    client.query(
      `UPDATE users SET  name = "${userDetails.name}", email = "${userDetails.email}", username="${userDetails.username}" WHERE id = ${userDetails.userID}`,
      function (error, result) {
        if (error) {
          console.log("Error is", error);
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function updateAdminAccess(client, userDetails) {
  return new Promise(function (resolve, reject) {
    client.query(
      `UPDATE users SET adminAccess = "${userDetails.status}" WHERE id = ${userDetails.userID}`,
      function (error, result) {
        if (error) {
          console.log("Error is", error);
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function getProfileByID(client, userID) {
  console.log(userID);
  return new Promise(function (resolve, reject) {
    return client.query(
      `SELECT * from users as u JOIN userDetails as ud WHERE u.id = ud.id AND u.id = ${userID}`,
      function (error, result, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

//addBiography

async function addBiography(client, bioDetail) {
  return new Promise(function (resolve, reject) {
    client.query(
      `INSERT INTO biography (user, bio) VALUES (${bioDetail.userID}, "${bioDetail.bio}")`,
      function (error, result) {
        if (error) {
          console.log("Error is", error);
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}
async function updateBiography(client, userDetails) {
  return new Promise(function (resolve, reject) {
    client.query(
      `UPDATE BioGraphy SET bio = "${userDetails.bio}" WHERE user = ${userDetails.userID}`,
      function (error, result) {
        if (error) {
          console.log("Error is", error);
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function getAllAdmin(client) {
  return new Promise(function (resolve, reject) {
    return client.query(
      `SELECT * from users  where userType = 'admin' OR userType='superadmin' ORDER BY noOfFollower DESC`,
      function (error, result, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function getAdminsListing(client) {
  return new Promise(function (resolve, reject) {
    return client.query(
      `SELECT * from users  where userType = 'admin' OR userType='superadmin'`,
      function (error, result, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function getUsersListing(client) {
  return new Promise(function (resolve, reject) {
    return client.query(
      `SELECT * from users  where userType = 'user'`,
      function (error, result, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}
async function checkAlradyFollow(client, followDetails) {
  return new Promise(function (resolve, reject) {
    client.query(
      `Select * from followers where userid = ${followDetails.userID} AND followerid= ${followDetails.adminID}`,
      function (error, result) {
        if (error) {
          console.log("Error is", error);
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function getFollowersByID(client, adminID) {
  return new Promise(function (resolve, reject) {
    return client.query(
      `SELECT * from followers as f JOIN users as u WHERE f.userid = u.id AND f.followerid = ${adminID}`,
      function (error, result, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function updateAdminProfile(client, adminDetails) {
  return new Promise(function (resolve, reject) {
    client.query(
      `UPDATE users SET name = "${adminDetails.name}", username = "${adminDetails.username}", active = ${adminDetails.active}, block = ${adminDetails.block} WHERE id = ${adminDetails.id}`,
      function (error, result) {
        if (error) {
          console.log("Error is", error);
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function deleteAdminProfile(client, adminDetails) {
  await client.query(`DELETE FROM users WHERE id = ${adminDetails.id}`);
  return new Promise(function (resolve, reject) {
    return client.query(
      `SELECT * from users where userType = 'admin' OR userType='superadmin' ORDER BY noOfFollower DESC`,
      function (error, result, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function updateUserProfile(client, userDetails) {
  return new Promise(function (resolve, reject) {
    client.query(
      `UPDATE users SET name = "${userDetails.name}", username = "${userDetails.username}", active = ${userDetails.active}, block = ${userDetails.block} WHERE id = ${userDetails.id}`,
      function (error, result) {
        if (error) {
          console.log("Error is", error);
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function deleteUserProfile(client, userDetails) {
  await client.query(`DELETE FROM users WHERE id = ${userDetails.id}`);
  return new Promise(function (resolve, reject) {
    return client.query(
      `SELECT * from users where userType = 'user' ORDER BY noOfFollower DESC`,
      function (error, result, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}
module.exports = {
  updateProfileByID: updateProfileByID,
  getProfileByID: getProfileByID,
  getAllAdmin: getAllAdmin,
  updateBiography: updateBiography,
  addBiography: addBiography,
  getFollowersByID: getFollowersByID,
  checkAlradyFollow: checkAlradyFollow,
  updateAdminAccess: updateAdminAccess,
  getAdminsListing: getAdminsListing,
  updateAdminProfile: updateAdminProfile,
  updateUserProfile: updateUserProfile,
  deleteAdminProfile: deleteAdminProfile,
  deleteUserProfile: deleteUserProfile,
  getUsersListing: getUsersListing,
};

