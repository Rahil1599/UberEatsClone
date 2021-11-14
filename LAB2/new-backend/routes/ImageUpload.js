const { upload } = require("../service/fileUploadService");
const { checkAuth } = require("../utils/passport");

const router = require("express").Router();

router.post("/image/:entity", checkAuth, upload.single('image'),(req,res,next)=>{
    res.send({imageUrl:req.file.location});
});

module.exports = router;