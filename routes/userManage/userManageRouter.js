const router = require("express-promise-router")();
const DB = require("../../model/db");
const User = require("../../model/User/User");

const getAllUsers = async(req,res)=>{

    try{
        const userResponse = await User.getAllUser(DB.connection);
        res.status(200).send({
            users:userResponse,
            success:true
        })

    }catch(e){
        res.status(500).send({
            msg:'failed',
            success:false
        })
    }
}
const saveUserInfo = async(req,res)=>{
    try{
        const saveResponse = await User.updateUserInfo(
            DB.connection,
            req.body.user
        );
        if (saveResponse.affectedRows === 1) {
            res.status(200).send({
                msg: "save successfully",
                success: true
            });
        }else{
            res.status(400).send({
                msg: "save failed",
                success: false
            });
        }
        
    }catch(e){
        res.status(500).send({
            msg: "Save failed",
            success: false,
            error: e
          });
    }
}

router.get("/",getAllUsers)
router.post("/save",saveUserInfo)

module.exports = router;