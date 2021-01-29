
async function getAllUsers(client) {
  return new Promise(function (resolve, reject) {
    return client.query("SELECT * from users", function (error, result, fields) {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function getAllShipper(client) {
  return new Promise(function (resolve, reject) {
    return client.query("SELECT * from users where role = 'Shipper'", function (error, result, fields) {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}
async function updateUserPaswordById(client, userId, hash) {
 
  return client.query(
    `UPDATE users SET password='${hash}' WHERE id = ${userId}`
  );

}

async function updateProfile(client,userDetails ,userId) {
  console.log("ready to update ")
 
  return new Promise(function (resolve, reject) {
    return client.query(`UPDATE users SET name = '${userDetails.name}', email = '${userDetails.email}', city = '${userDetails.city}', states = '${userDetails.states}', contact = '${userDetails.contact}', country = '${userDetails.country}', postal = '${userDetails.postal}'
    
    WHERE id = ${userId}`, function (error, result, fields) {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}


async function getAllServiceProvider(client) {
  return new Promise(function (resolve, reject) {
    return client.query("SELECT * from users WHERE role = 'Service Provider'", function (error, result, fields) {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function getUserByID(client, userID) {
  return new Promise(function (resolve, reject) {
    return client.query(`SELECT * from users WHERE id = ${userID}`, function (error, result, fields) {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function updateBlockStatus(client, userDetails) {
  return new Promise(function (resolve, reject) {
    return client.query(`UPDATE users SET is_block = ${userDetails.status} WHERE id = ${userDetails.userID}`, function (error, result, fields) {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}


module.exports = {
  getAllUsers: getAllUsers,
  getAllShipper: getAllShipper,
  getAllServiceProvider: getAllServiceProvider,
  getUserByID: getUserByID,
  updateProfile:updateProfile,
  updateUserPaswordById:updateUserPaswordById,
  updateBlockStatus: updateBlockStatus
};
