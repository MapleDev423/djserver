const router = require('express-promise-router')();

const adminRouter = require('./admin/adminRouter');
const userRouter = require('./user/userRouter');
const authRouter = require("./auth").authRouter;
const userManageRouter = require('./userManage/userManageRouter');

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/usermanage',userManageRouter);

module.exports = router;