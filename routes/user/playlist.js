const router = require("express-promise-router")();
const DB = require("../../model/db");
const Playlist = require("../../model/Playlist/Playlist");
const Song = require("../../model/Playlist/Song");

const updatePlaylistView = async (req, res) => {
  try {
    const playlistResponse = await Playlist.updatePlaylistView(
      DB.connection,
      req.body.playlistID
    );
    if (playlistResponse.affectedRows === 1) {
      res.status(200).send({
        playlistResponse: playlistResponse,
        msg: "view updated successfully",
        success: true
      });
    } else {
      res.status(400).send({
        playlistResponse: playlistResponse,
        msg: "Playlost not added",
        success: false
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "playlistResponse failed",
      success: false,
      error: e
    });
  }
};

const getPlaylistByID = async (req, res) => {
  try {
    const playlistResponse = await Playlist.getPlaylistByID(
      DB.connection,
      req.query.playlistID
    );
    console.log("playlist", playlistResponse);
    if (playlistResponse.length > 0) {
      res.status(200).send({
        playlistResponse: playlistResponse,
        msg: "playlistResponse fetched successfully",
        success: true
      });
    } else {
      res.status(400).send({
        playlistResponse: playlistResponse,
        msg: "Playlost not added",
        success: false
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "playlistResponse failed",
      success: false,
      error: e
    });
  }
};

const getAllPlaylist = async (req, res) => {
  try {
    const playlistResponse = await Playlist.getAllPlaylist(DB.connection);
    console.log("playlistResponse",playlistResponse)

    if (playlistResponse.length > 0) {
      res.status(200).send(playlistResponse);
    } else {
      res.status(400).send({
        playlistResponse: playlistResponse,
        msg: "Playlost not added",
        success: false
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "playlistResponse failed",
      success: false,
      error: e
    });
  }
};

const getPlaylistByAdmin = async (req, res) => {
  try {
    const playlistResponse = await Playlist.getPlaylistsByAdmin(
      DB.connection,
      req.query.userID
    );
    console.log("playlist", playlistResponse);
    if (playlistResponse.length > 0) {
      res.status(200).send({
        playlistResponse: playlistResponse,
        msg: "playlistResponse fetched successfully",
        success: true
      });
    } else {
      res.status(400).send({
        playlistResponse: playlistResponse,
        msg: "Playlost not added",
        success: false
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "playlistResponse failed",
      success: false,
      error: e
    });
  }
};

const addPlaylistToFavourite = async (req, res) => {
  try {
    const playlistResponsealready = await Playlist.checkAlradyFav(
      DB.connection,
      req.body
    );
    
    console.log(playlistResponsealready.length);
    if (playlistResponsealready.length === 1) {
     
      return res.status(400).send({
        msg: "Already Favorite",
        success: true
      });
    } else {
      // getPlaylistById
      const getPlaylist = await Playlist.getPlaylistByID(DB.connection,req.body.playlistID)
     
      const favCount = getPlaylist[0].noOfFavorite+1
      const favCountResponse = await Playlist.updatePlaylistFavCount(DB.connection, req.body.playlistID, favCount)
      if (favCountResponse.affectedRows === 1) {
          try {
        const playlistResponse = await Playlist.addPlaylistToFavourite(
          DB.connection,
          req.body
        );
        if (playlistResponse.affectedRows === 1) {
          return res.status(200).send({
            msg: "view updated successfully",
            success: true
          });
        } else {
          return res.status(400).send({
            playlistResponse: playlistResponse,
            msg: "Playlost not added",
            success: false
          });
        }
      } catch (e) {
        return res.status(500).send({
          msg: "playlistResponse failed",
          success: false,
          error: e
        });
      }
        
      }
      else {
        return res.status(400).send({
          playlistResponse: playlistResponse,
          msg: "Playlost not added",
          success: false
        });

      }

      
    
     }
  } catch (e) {
    return res.status(500).send({
      msg: "playlistResponse failed",
      success: false,
      error: e
    });
  }
};

const getFavouritePlaylistsByID = async (req, res) => {
  try {
    const playlistResponse = await Playlist.getFavouritePlaylistsByID(
      DB.connection,
      req.query.playlistID
    );
    console.log("playlistResponse",playlistResponse)
    if (playlistResponse.length > 0) {
      res.status(200).send(playlistResponse);
    } else {
      res.status(400).send(playlistResponse)
    }
  } catch (e) {
    res.status(500).send({
      msg: "playlistResponse failed",
      success: false,
      error: e
    });
  }
};

router.post("/updatePlaylistView", updatePlaylistView);
router.post("/addPlaylistToFavourite", addPlaylistToFavourite);
router.get("/getPlaylistByID", getPlaylistByID);
router.get("/getFavouritePlaylistsByID", getFavouritePlaylistsByID);
router.get("/getAllPlaylist", getAllPlaylist);
router.get("/getPlaylistByAdmin", getPlaylistByAdmin);

module.exports.playlistRouter = router;
