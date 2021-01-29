const router = require("express-promise-router")();
const DB = require("../../model/db");
const Admin = require("../../model/Admin/Admin");
const bcrypt = require("bcrypt");
const Auth = require("../../model/Auth");
var multer = require("multer");
const saltRounds = 10;
var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log("Audio file", file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});
var upload = multer({
  storage: storage,
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log("Audio file uplaods", file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});
var uploads = multer({
  storage: storage,
});

const updateProfileByID = async (req, res) => {
  try {
    const user = await Auth.getUserById(DB.connection, req.body.userID);

    const userByEmail = await Auth.getUserByEmail(
      DB.connection,
      req.body.email
    );

    const userByUsername = await Auth.getUserByUsername(
      DB.connection,
      req.body.username
    );

    if (
      userByUsername.length == 1 &&
      user[0].username != userByUsername[0].username
    ) {
      return res.status(400).send({
        msg: "That username is taken. Try another",
        success: false,
      });
    }

    if (userByEmail.length == 1 && user[0].email != userByEmail[0].email) {
      console.log("hrrrrr");
      return res.status(400).send({
        msg: "That email is taken. Try another",
        success: false,
      });
    }

    const adminResponse = await Admin.updateProfileByID(
      DB.connection,
      req.body
    );
    if (adminResponse.affectedRows === 1) {
      res.status(200).send({
        adminResponse: adminResponse,
        msg: "profile updated successfully",
        success: true,
      });
    } else {
      res.status(400).send({
        adminResponse: adminResponse,
        msg: "Profile not added",
        success: false,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "adminResponse failed",
      success: false,
      error: e,
    });
  }
};

const updateAdminAccess = async (req, res) => {
  try {
    const adminResponse = await Admin.updateAdminAccess(
      DB.connection,
      req.body
    );
    if (adminResponse.affectedRows === 1) {
      res.status(200).send({
        adminResponse: adminResponse,
        msg: "profile updated successfully",
        success: true,
      });
    } else {
      res.status(400).send({
        adminResponse: adminResponse,
        msg: "Playlist not added",
        success: false,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "adminResponse failed",
      success: false,
      error: e,
    });
  }
};

const getProfileByID = async (req, res) => {
  try {
    const adminResponse = await Admin.getProfileByID(
      DB.connection,
      req.query.adminID
    );
    if (adminResponse.length > 0) {
      res.status(200).send({
        adminResponse: adminResponse,
        msg: "admin fetched successfully",
        success: true,
      });
    } else {
      res.status(400).send({
        adminResponse: adminResponse,
        msg: "Playlost not added",
        success: false,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "adminResponse failed",
      success: false,
      error: e,
    });
  }
};

const getFollowersByID = async (req, res) => {
  try {
    const userResponse = await Admin.getFollowersByID(
      DB.connection,
      req.query.adminID
    );
    if (userResponse.length > 0) {
      res.status(200).send({
        userResponse: userResponse,
        msg: "admin fetched successfully",
        success: true,
      });
    } else {
      res.status(400).send({
        userResponse: userResponse,
        msg: "Playlost not added",
        success: false,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "userResponse failed",
      success: false,
      error: e,
    });
  }
};

const AddBio = async (req, res) => {
  try {
    const user = await Auth.getUserBioById(DB.connection, req.body.userID);

    if (user.length === 1) {
      const bioResponsess = await Admin.updateBiography(
        DB.connection,
        req.body
      );

      if (bioResponsess.affectedRows === 1) {
        console.log("dddd");
        return res.status(200).send({
          msg: "Bio Added",
          success: true,
        });
      }
    } else {
      console.log("ddddjvjv");

      const bioResponse = await Admin.addBiography(DB.connection, req.body);

      if (bioResponse.affectedRows === 1) {
        return res.status(200).send({
          msg: "Bio Added",
          success: true,
        });
      }
    }
  } catch (e) {
    return res.status(500).send({
      msg: "playlistResponse failed",
      success: false,
      error: e,
    });
  }
};

router.post("/update-password", async (req, res) => {
  try {
    if (req.body.password.length <= 4) {
      return res.status(400).send({
        msg: "Use 5 character or more for your password",
        success: false,
      });
    }
    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).send({
        msg: "Those passwords didn't match. Try again.",
        success: false,
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      const response = await Auth.getUserById(DB.connection, req.body.token);

      if (response.length == 0) {
        return res.status(400).send({
          msg: "Not Exist",
          success: false,
        });
      }

      await Auth.updateUserById(DB.connection, response[0].id, hash);
      return res.status(201).send({
        msg: "password update",
        success: false,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "Internal server error",
      success: false,
    });
  }
});

const getAdminBio = async (req, res) => {
  try {
    const response = await Auth.getUserBioById(DB.connection, req.query.userID);
    console.log("ddddd", response[0]);
    return res.status(201).send({
      msg: response[0],
      success: false,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Internal server error",
      success: false,
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const response = await Admin.getAdminsListing(DB.connection);
    return res.status(201).send({
      msg: response,
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Internal server error",
      success: false,
    });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const adminResponse = await Admin.updateAdminProfile(
      DB.connection,
      req.body
    );
    if (adminResponse.affectedRows === 1) {
      res.status(200).send({
        adminResponse: adminResponse,
        msg: "profile updated successfully",
        success: true,
      });
    } else {
      res.status(400).send({
        adminResponse: adminResponse,
        msg: "Playlist not added",
        success: false,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "adminResponse failed",
      success: false,
      error: e,
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const adminResponse = await Admin.deleteAdminProfile(
      DB.connection,
      req.body
    );
    res.status(200).send({
      adminResponse: adminResponse,
      msg: "profile deleted successfully",
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "adminResponse failed",
      success: false,
      error: e,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await Admin.getUsersListing(DB.connection);
    return res.status(200).send({
      msg: response,
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Internal server error",
      success: false,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const adminResponse = await Admin.updateUserProfile(
      DB.connection,
      req.body
    );
    if (adminResponse.affectedRows === 1) {
      res.status(200).send({
        adminResponse: adminResponse,
        msg: "profile updated successfully",
        success: true,
      });
    } else {
      res.status(400).send({
        adminResponse: adminResponse,
        msg: "Playlist not added",
        success: false,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "adminResponse failed",
      success: false,
      error: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const adminResponse = await Admin.deleteUserProfile(
      DB.connection,
      req.body
    );
    res.status(200).send({
      adminResponse: adminResponse,
      msg: "profile deleted successfully",
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "adminResponse failed",
      success: false,
      error: e,
    });
  }
};

router.post("/updateProfile", updateProfileByID);
router.post("/addBio", AddBio);
router.post("/updateAdminAccess", updateAdminAccess);
router.post("/updateAdminProfile", updateAdminProfile);
router.post("/updateUserProfile", updateUserProfile);
router.post("/deleteAdmin", deleteAdmin);
router.post("/deleteUser", deleteUser);
router.get("/getProfile", getProfileByID);
router.get("/getFollowersByID", getFollowersByID);
router.get("/getAdminBio", getAdminBio);
router.get("/getAllAdmins", getAllAdmins);
router.get("/getAllUsers", getAllUsers);

module.exports.adminRouter = router;
