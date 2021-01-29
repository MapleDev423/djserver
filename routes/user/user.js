const router = require("express-promise-router")();
const DB = require("../../model/db");
const User = require("../../model/User/User");
const Admin = require("../../model/Admin/Admin");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
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

const updateProfileByID = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    let user = {
      file: "http://72.14.189.240:3000/images/" + req.file.filename,
      password: hash,
      name: req.body.name,
      userID: req.body.userID,
    };

    const userResponse = await User.updateProfileByID(DB.connection, user);
    if (userResponse.affectedRows === 1) {
      res.status(200).send({
        userResponse: userResponse,
        msg: "profile updated successfully",
        success: true,
      });
    } else {
      res.status(400).send({
        userResponse: userResponse,
        msg: "Playlist not added",
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

const followAdmin = async (req, res) => {
  try {
    const followAdminAlready = await Admin.checkAlradyFollow(
      DB.connection,
      req.body
    );

    if (followAdminAlready.length === 1) {
      return res.status(400).send({
        msg: "Already Follow",
        success: true,
      });
    } else {
      const getAdmin = await User.getProfileByID(
        DB.connection,
        req.body.adminID
      );
      const followerCount = getAdmin[0].noOfFollower + 1;

      const followerCountResponse = await User.updateadminFollowCount(
        DB.connection,
        req.body.adminID,
        followerCount
      );

      if (followerCountResponse.affectedRows === 1) {
        try {
          const userResponse = await User.followAdmin(DB.connection, req.body);
          if (userResponse.affectedRows === 1) {
            res.status(200).send({
              userResponse: userResponse,
              msg: "follow successfully",
              success: true,
            });
          } else {
            res.status(400).send({
              userResponse: userResponse,
              msg: "follow not added",
              success: false,
            });
          }
        } catch (e) {
          res.status(400).send({
            userResponse: userResponse,
            msg: "follow not added",
            success: false,
          });
        }
      } else {
        res.status(400).send({
          userResponse: userResponse,
          msg: "follow not added",
          success: false,
        });
      }
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

const getProfileByID = async (req, res) => {
  try {
    const userResponse = await User.getProfileByID(
      DB.connection,
      req.query.userID
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

const getAllAdmin = async (req, res) => {
  try {
    const userResponse = await Admin.getAllAdmin(DB.connection);

    if (userResponse.length > 0) {
      res.status(200).send(userResponse);
    } else {
      res.status(400).send({
        userResponse: userResponse,
        msg: "Admin not get",
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

const getFollowedAdminsByID = async (req, res) => {
  try {
    console.log(req.query.userID);
    const userResponse = await User.getFollowedAdminsByID(
      DB.connection,
      req.query.userID
    );
    if (userResponse.length > 0) {
      res.status(200).send(userResponse);
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

const addPlaylistToFavourites = async (req, res) => {
  try {
    const userResponse = await Playlist.addPlaylistToFavourites(
      DB.connection,
      req.body
    );
    if (userResponse.affectedRows === 1) {
      res.status(200).send({
        userResponse: userResponse,
        msg: "playlist added successfully",
        success: true,
      });
    } else {
      res.status(400).send({
        userResponse: userResponse,
        msg: "Playlist not added",
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

const searchQuery = async (req, res) => {
  console.log("fffff here");
  console.log(req.params.keyword);
  try {
    const userResponse = await User.searchQuery(
      DB.connection,
      req.params.keyword
    );
    if (userResponse.length > 0) {
      res.status(200).send(userResponse);
    } else {
      res.status(200).send(userResponse);
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

router.post("/updateProfile", upload.single("file"), updateProfileByID);
router.post("/followAdmin", followAdmin);
router.post("/addPlaylistToFavourites", addPlaylistToFavourites);
router.get("/getProfile", getProfileByID);
router.get("/getAllAdmin", getAllAdmin);
router.get("/searchQuery/:keyword", searchQuery);
router.get("/getFollowedAdminsByID", getFollowedAdminsByID);

module.exports.userRouter = router;
