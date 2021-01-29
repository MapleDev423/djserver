const DB = require("./db");

async function adminLogin(client, email) {
  return new Promise(function (resolve, reject) {
    client.query(`SELECT * from users where email = "${email}"`, function (
      error,
      result,
      fields
    ) {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function userLogin(client, email, role) {
  console.log(email,role)
  return new Promise(function (resolve, reject) {
    client.query(`SELECT * from users where (email = "${email}" OR username = "${email}") AND userType = "${role}" `, function (
      error,
      result,
      fields
    ) {
      if (error) {

        reject(error);
        return;
      }

      resolve(result);
    });
  });
}




async function userRegister(client, userDetails) {
  return new Promise(function (resolve, reject) {
    client.query(
      `INSERT INTO users (name, userType,imageUrl, email, username, password, token, active, forget, block, adminAccess) VALUES ("${userDetails.name}","${userDetails.userType}","https://img.icons8.com/color/2x/test-account.png", "${userDetails.email}", "${userDetails.username}", "${userDetails.password}","${userDetails.token}","${userDetails.active}","${userDetails.forget}","${userDetails.block}","${userDetails.adminAccess}")`,
      function (error, result, fields) {
        if (error) {
          console.log("Error is", error)
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}

async function getUserByToken(client, token) {

  return new Promise(function (resolve, reject) {
    client.query(`SELECT * from users where token = '${token}'`, function (
      error,
      result,
      fields
    ) {
      if (error) {
        console.log("User", error)
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function getUserByEmail(client, email) {
  console.log("Email", email)
  //console.log("client:",client)
  return new Promise(function (resolve, reject) {
    client.query(`SELECT * from users where email = '${email}'`, function (

      error,
      result,
      fields
    ) {
      if (error) {

        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function getUserByUsername(client, username) {
  return new Promise(function (resolve, reject) {
    client.query(`SELECT * from users where username = '${username}'`, function (

      error,
      result,
      fields
    ) {
      if (error) {

        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function getUserById(client, id) {
  return new Promise(function (resolve, reject) {
    client.query(`SELECT * from users where id = '${id}'`, function (

      error,
      result,
      fields
    ) {
      if (error) {

        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function getUserBioById(client, id) {
  return new Promise(function (resolve, reject) {
    client.query(`SELECT * from BioGraphy where id = '${id}'`, function (

      error,
      result,
      fields
    ) {
      if (error) {

        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function updateUser(client, userId) {
  return client.query(
    `UPDATE users SET token = '',active = '${1}' WHERE id = ${userId}`
  );
}
async function updateUserById(client, userId, hash) {

  return client.query(
    `UPDATE users SET token = '',forget = '${0}',password='${hash}' WHERE id = ${userId}`
  );

}

async function updateProfileImage(client, email, fileUrl) {
  return new Promise(function (resolve, reject) {
   client.query(
    `UPDATE users SET imageUrl = '${fileUrl}'  WHERE email = '${email}'`
    , function (

      error,
      result,
      fields
    ) {
      if (error) {

        reject(error);
        return;
      }
      resolve(result);
    });
  });
}


async function updateUserSetToken(client, userId, token) {
  return client.query(
    `UPDATE users SET token = '${token}',forget = '${1}' WHERE id = ${userId}`
  );

}

module.exports = {
  adminLogin: adminLogin,
  updateProfileImage:updateProfileImage,
  getUserById: getUserById,
  userLogin: userLogin,
  userRegister: userRegister,
  getUserBioById:getUserBioById,
  getUserByToken: getUserByToken,
  updateUser: updateUser,
  getUserByEmail: getUserByEmail,
  updateUserById: updateUserById,
  updateUserSetToken: updateUserSetToken,
  getUserByUsername: getUserByUsername,
};