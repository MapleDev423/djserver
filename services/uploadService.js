const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require('fs');

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let { mode } = req.query
    let dest = path.join(`${__dirname}/../public`)
    if(mode == 'audio'){
        dest = path.join(`${dest}/audio/`)
    }
    
    if (!fs.existsSync(dest)) {
      
        fs.mkdirSync(dest)
    }
    callback(null, dest);
  },
  filename: (req, file, callback) => {
    let { mode } = req.query
    var filename = file.originalname
    if(mode == 'audio')
      filename = `audio-${Date.now()}.mp3`;
    if(mode == 'flag')
      filename = `flag-${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).single("singleFile");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
