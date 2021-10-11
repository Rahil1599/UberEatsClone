const router = require("express").Router();
const dbPool = require('../connections/DBConnection');
const {v4 : uuidv4} = require('uuid');

//query restaurants based on country and city
router.get("/restaurant",function(req,res){
    const country = req.query.country;
    const city = req.query.city;
    let queryCondition='';
    // if(country.length)
    //   queryCondition = queryCondition + " where Country = ? ";
    // if(city.length)
    //   queryCondition = queryCondition + "and City = ?";
    const query = "Select * FROM Restaurant" + queryCondition;
    dbPool.query(query,[country,city], (err,results,fields)=>{
        res.status(200).send(results);
    });
});

//retrieve all restaurants
router.get("/restaurants",function(req,resp){
    const query = "select * from Restaurant";
    dbPool.query(query, (err,results,fields)=>{
        resp.status(200).send(results);
    });
});

router.get("/dishes",function(req,res){
    const name = req.query.name;
    const query = "SELECT * FROM Dishes where RestaurantId = ?";
    dbPool.query(query,[restaurantId], (err,results,fields)=>{
        res.status(200).send(results);

    });
});

module.exports = router;
