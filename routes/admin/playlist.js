const router = require("express-promise-router")();
const DB = require("../../model/db");
const Playlist = require("../../model/Playlist/Playlist");
const Song = require("../../model/Playlist/Song")
var multer = require("multer");
var config = require('../../config');
const { getAllPlaylist } = require("../../model/Playlist/Playlist");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log("dfddf", file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "audio/mpeg") {
      filetype = "mp3";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  }
}).single("myFile");

//const createPlaylist = async (req, res) => {

router.post("/createPlaylist", upload, async function (req, res) {
  try {
    const fileUrl = config.url.backendUrl + "/images/" + req.file.filename;
    const playlistResponse = await Playlist.addNewPlaylist(DB.connection, req.body.title, fileUrl, req.body.description, 0, req.body.id);
    
    if (playlistResponse.affectedRows === 1) {

    ///  await Playlist.addNewNotification(DB.connection, playlistResponse.insertId);

      res.status(200).send({
        playlistResponse: playlistResponse,
        msg: "playlist added successfully",
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
})

const uploadSongToPlaylist = async (req, res) => {
 
  try {
    const playlistResponse = await Song.addNewSong(DB.connection, req.body);
 
    if (playlistResponse.affectedRows === 1) {
      res.status(200).send({
        playlistResponse: playlistResponse,
        msg: "playlistResponse fetched successfully",
        success: true
      });
    } else {
      res.status(400).send({
        playlistResponse: playlistResponse,
        msg: "Playlist not added",
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
}

const updatePlaylist = async (req, res) => {
  try {
    const playlistResponse = await Playlist.updatePlaylist(DB.connection, req.body);
    if (playlistResponse.affectedRows === 1) {
      res.status(200).send({
        playlistResponse: playlistResponse,
        msg: "playlistResponse updated successfully",
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
}

const getPlaylistByID = async (req, res) => {
  try {
    const playlistResponse = await Playlist.getPlaylistByID(DB.connection, req.query.playlistID);

    if (playlistResponse.length > 0) {
      res.status(200).send({
        playlistResponse: playlistResponse,
        msg: "playlistResponse fetched successfully",
        success: true
      });
      try {
        const viewCount = playlistResponse[0].views+1
    const favCountResponse = await Playlist.updatePlaylistViewCount(DB.connection, req.query.playlistID, viewCount)

      }
      catch (e) {
      }
    } else {
      res.status(400).send({
        playlistResponse: playlistResponse,
        msg: "Playlist not added",
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
}


const getPlaylistByAdmin = async (req, res) => {
 

  try {
    const playlistResponse = await Playlist.getPlaylistsByAdmin(DB.connection, req.query.adminID);
    
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
}



const getSonginPlaylist = async (req, res) => {
  

  try {
    const songResponse = await Song.getSongInPlaylist(DB.connection, req.query.playlistID);
    if (songResponse.length > 0) {
      res.status(200).send({
        songResponse: songResponse,
        msg: "songResponse fetched successfully",
        success: true
      });
    } else {
      console.log("i am in elde ")
      res.status(200).send({
        songResponse: [],
        msg: "There is no song in the playslt",
        success: true
      });
    }

  } catch (e) {
    res.status(500).send({
      msg: "playlistResponse failed",
      success: false,
      error: e
    });
  }
}

const getLatestNotifications = async (req, res) => {
  NotificationArray = []

  try {
    const playlistNotification = await Playlist.getAllNotifications(DB.connection);
    //console.log("playlistNotification",playlistNotification)
    
    if (playlistNotification.length <=5) {
      NotificationArray = playlistNotification
      res.status(200).send(NotificationArray)
       
    }
    else if (playlistNotification.length >5) {
      for (var i = 0; i < 5; i++){
        NotificationArray.push(playlistNotification[i])
        
      }
      res.status(200).send(NotificationArray)
    }
    
     else {
      res.status(200).send({
        playlistNotification: [],
        msg: "There is no song in the playslt",
        success: true
      });
    }
  } catch (e) {
    console.log("eee",e)
    res.status(500).send({
      msg: "playlistNotification failed",
      success: false,
      error: e
    });
  }
}
/**apolo */

const getPlaylist =  async(req,res)=>{
  try{
    let playListArray = await Playlist.getAllPlaylist(DB.connection);
    res.status(200).send(playListArray);
  }catch(e){
    res.status(500).send({
      msg:'fail'
    })
  }
}
const getAllSong = async(req,res)=>{
  try{
    let songListArray = await Song.getAllSong(DB.connection);
    res.status(200).send(songListArray);
  }catch(e){
    res.status(500).send({
      msg:'fail'
    })
  }
}
const savePlayList = async(req,res)=>{
  try{
    let {playlistID,songlist} = req.body
    await Playlist.removeSongsfromPlayList(DB.connection,playlistID);
    //await Playlist.addSongtoPlayList(DB.connection.playlistID,songlist);
    res.status(200).send(songListArray);
  }catch(e){
    res.status(500).send({
      msg:'fail'
    })
  }
}
const addSongtoPlayList = async(req,res)=>{
  try{
    let {playlistID,filename,originname} = req.body
    await Song.addNewSong(DB.connection,originname,playlistID,`${process.env.CLIENT_SERVER}/audio/${filename}`);

    res.status(200).send({
      result:true
    });

  }catch(e){
    res.status(500).send({
      msg:'fail'
    })
  }
}
const removeSongToPlayList = async(req,res)=>{
  try{
    let {playlistID,songId} = req.body
    await Song.removeSong(DB.connection,songId);

    res.status(200).send({
      result:true
    });

  }catch(e){
    res.status(500).send({
      msg:'fail'
    })
  }
}
// const getPlayListDetail =  async(req,res)=>{
//   try{
//     let getPlayListDetail = await Playlist.getPlayListDetail(DB.connection);
//     res.status(200).send(getPlayListDetail);
//   }catch(e){
//     res.status(500).send({
//       msg:'fail'
//     })
//   }
// }


//router.post("/createPlaylist", uplaod, createPlaylist);
router.post("/updatePlaylist", updatePlaylist);
router.post("/uploadSong", uploadSongToPlaylist);
router.get("/getPlaylistByID", getPlaylistByID);
router.get("/getPlaylistByAdmin", getPlaylistByAdmin);
router.get("/getSonginPlaylist", getSonginPlaylist);
router.get("/getLatestNotifications", getLatestNotifications);

router.get("/getAllPlayList",getPlaylist);
router.get("/getAllSong",getAllSong);
router.post("/savePlayList",savePlayList)
//router.get("/getPlayListDetail",getPlayListDetail);

router.post("/addSongToPlayList",addSongtoPlayList)

router.post("/removeSongToPlayList",removeSongToPlayList)

module.exports.playlistRouter = router;