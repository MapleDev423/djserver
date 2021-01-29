var jwt = require("jsonwebtoken");
var router = require("express-promise-router");

function ensureWebToken(req, res, next) {
  const { authorization } = req.headers;

  try {
    jwt.verify(authorization, "testing");
    console.log("jwt.decode(authorization)", jwt.decode(authorization));
    const { id, email, role,imageUrl } = jwt.decode(authorization);
    req.user = { id: id, email: email, role: role,imageUrl:imageUrl };

    next();
  } catch (e) {
    res.status(401).send();
  }
}

module.exports = {
  ensureWebToken: ensureWebToken
};
