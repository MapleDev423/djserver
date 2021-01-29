const express = require("express");
const bodyParser = require("body-parser");
const DB = require("./model/db");
var cors = require("cors");
var path = require('path');
const https = require('https');
const fs = require('fs');
const indexRouter = require("./routes/indexRouter");
const config = require("./config")
const app = express();
var multer = require('multer');
var upload = multer();
const dotenv = require('dotenv');

const uploadService = require('./services/uploadService')
dotenv.config()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
// app.use(upload.array()); 

// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// main router

app.get('/', (req, res) => {
  res.send('API Server is running');
});

app.use("/", indexRouter);

app.post('/uploadfile',async function(req,res){
  await uploadService(req, res)
  res.status(200).json({
      file:req.file,
      result:true
  })
})

app.use((req, res) => {
  res.status(404).send();
});
app.listen(5000, function () {
  console.log("Node app is running on port 5000");
});
/*
if (config.environment === 'production') {
  https.createServer({
      key: fs.readFileSync('../openssl/key.pem'),
      cert: fs.readFileSync('../openssl/cert.pem'),
      passphrase: ''
    }, app)
    .listen(443);
} else {
  app.listen(5000, function () {
    console.log("Node app is running on port 5000");
  });
}
*/
module.exports = app;