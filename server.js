var express = require("express");
var app = express();
var bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// default route
app.get("/", function(req, res) {
  return res.send({ error: true, message: "hello" });
});
// set port
app.listen(3001, function() {
  console.log("Node app is running on port 3000");
});
module.exports = app;
