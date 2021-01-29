const router = require("express-promise-router")();
const jwt = require("jsonwebtoken");

const playlistRouter = require("./playlist").playlistRouter;
const adminRouter = require("./admin").adminRouter;
const songRouter = require("./UplaodSong").songRouter

const { ensureWebToken } = require("../middlewares");

router.use("/playlist", playlistRouter);
router.use("/api", adminRouter);
router.use("/uplaodSong", songRouter);

module.exports = router;
