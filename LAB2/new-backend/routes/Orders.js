const router = require("express").Router();
var kafka = require('../kafka/client');
const { checkAuth } = require("../utils/passport");

router.post("/orders/customer/:id", checkAuth, async  (req, res) => {
    console.log("error here");
    const request = {
        query: req.query, params: req.params, body: req.body,
    }
    console.log("this is my request: ");
    console.log(request);

    kafka.make_request('ubereats.create.customerOrder',request, function(error,results){
        if (error){
            res.status(400).send(error)
        }else{
            res.status(200).send(results);
        }
    });
});

router.get("/orders/customer/:id", checkAuth, async (req, res) => {
    console.log("trying to get my order");
    const request = {
        query: req.query, params: req.params, body: req.body,
    }
    
    kafka.make_request('ubereats.get.customerOrders',request, function(error,results){
        if (error){
            res.status(400).send(error)
        }else{
            res.status(200).send(results);
        }
    });
});

router.get("/orders/restaurant/:id", checkAuth, async (req, res) => {

    const request = {
        query: req.query, params: req.params, body: req.body,
    }
    
    kafka.make_request('ubereats.get.restaurantOrders',request, function(error,results){
        if (error){
            res.status(400).send(error)
        }else{
            res.status(200).send(results);
        }
    });
});

router.post("/orders/:id/status", checkAuth, async (req, res)=> {

    const request = {
        query: req.query, params: req.params, body: req.body,
    }
    
    kafka.make_request('ubereats.update.OrderStatus',request, function(error,results){
        if (error){
            res.status(400).send(error)
        }else{
            res.status(200).send(results);
        }
    });
});

router.get("/orders/:id", checkAuth, async (req, res) => {

    const request = {
        query: req.query, params: req.params, body: req.body,
    }
    
    kafka.make_request('ubereats.get.Oder',request, function(error,results){
        if (error){
            res.status(400).send(error)
        }else{
            res.status(200).send(results);
        }
    });
});

router.get("/orders/:id/items", async (req, res)=> {

    const request = {
        query: req.query, params: req.params, body: req.body,
    }
    
    kafka.make_request('ubereats.get.OderItems',request, function(error,results){
        if (error){
            res.status(400).send(error)
        }else{
            res.status(200).send(results);
        }
    });
});

module.exports = router;