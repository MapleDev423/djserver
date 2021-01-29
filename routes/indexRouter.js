const router = require('express-promise-router')();

const adminRouter = require('./admin/adminRouter');
const userRouter = require('./user/userRouter');
const authRouter = require("./auth").authRouter;


router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);

module.exports = router;