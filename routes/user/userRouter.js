const router = require("express-promise-router")();

const userRouter = require("./user").userRouter;
const playlistRouter = require("./playlist").playlistRouter;

const {
    ensureWebToken
} = require("../middlewares");

router.use("/playlist", playlistRouter);
router.use("/api", userRouter);

module.exports = router;