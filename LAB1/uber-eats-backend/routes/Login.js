const router = require("express").Router();
const dbPool = require('../connections/DBConnection');
const bcrypt = require("bcrypt");


router.post("/customer/login",function(req,resp){
    
    const email = req.body.email;
    const password = req.body.password;

    const query = "SELECT * FROM Customer where EmailId = ?";
    dbPool.query(query,[email],async (err,results,fields)=>{
        if(results.length == 0)
          resp.status(400).send({message:"user not found"});
        const isValid = await bcrypt.compare(
            password,
            results[0]["CustomerPassword"]
        );
        if(isValid){
            delete results[0]["CustomerPassword"];
            resp.status(200).send(results[0]);
        }else{
            resp.status(400).send({message:"invalid credentails"});
        }
    })
});

router.post("/restaurant/login",function(req,resp){
    
    const email = req.body.email;
    const password = req.body.password;

    const query = "SELECT * FROM Restaurant where EmailId = ?";
    dbPool.query(query,[email],async (err,results,fields)=>{
        const isValid = await bcrypt.compare(
            password,
            results[0]["RestaurantPassword"]
        );
        if(isValid){
            delete results[0]["RestaurantPassword"];
            resp.status(200).send(results[0]);
        }else{
            resp.status(400).send({message:"invalid credentails"});
        }
    })
});



module.exports = router;
