const router = require("express-promise-router")();
const DB = require("../../model/db");
const Playlist = require("../../model/Playlist/Playlist");
const Song = require("../../model/Playlist/Song");
var multer = require("multer");
var config = require("../../config");
const upload = multer()
const fs = require('fs');


router.post("/songCount/:id", async function (req, res) {
  console.log("req.body", req.params.id)
  try {
    const getSong = await Song.getSongById(DB.connection,req.params.id)
    const songView = getSong[0].views+1
    const songCountResponse = await Song.updateSongCount(DB.connection,req.params.id, songView)
    if (songCountResponse.affectedRows === 1) {
      
    }
    else {

    }
  }
  catch (e) {
    
  }

  
})


router.post("/file", upload.single("file"), async (req, res) => {
    console.log("rrrr",req.body)
  
    let uploadLocation ='./public/audio/' + "audio-" + Date.now() + "." + 'mp3' // where to save the file to. make sure the incoming name has a .wav extension
    console.log("uploadLocation",uploadLocation)
    const fileUrl = config.url.backendUrl + "/audio/" + "audio-" + Date.now() + "." + 'mp3';
  
   
    
    fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
    try {
        const playlistResponse = await Song.addNewSong(DB.connection,req.file.originalname,req.body.playlistId,fileUrl);
    
        if (playlistResponse.affectedRows === 1) {
            res.json({ success: true });
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
 

});

module.exports.songRouter = router;
