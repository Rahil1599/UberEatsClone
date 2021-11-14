const Restaurants = require("../../model/Restaurants");

async function handle_request(req, callback){

    const restaurantId = req.params.id;
    var payload = {};
    let restaurant = await Restaurants.findOne({ RestaurantId: restaurantId });
    if (!restaurant) {
        error = {message: 'Restaurant not found'};
        callback(error,null);
    }
    else{
        payload = {
            RestaurantName:req.body.RestaurantName,
            RestaurantDesc: req.body.RestaurantDesc,
            PhoneNumber:req.body.PhoneNumber,
            Mode: req.body.Mode,
            Country: req.body.Country,
            State: req.body.State,
            City: req.body.State,
            Pincode: req.body.City,
            City: req.body.City,
            Pincode: req.body.Pincode,
            ImageUrl: req.body.ImageUrl,
            WorkHrsFrom: req.body.WorkHrsFrom,
            WorkHrsTo: req.body.WorkHrsTo
        }
    }

    Restaurants.findOneAndUpdate({ RestaurantId: restaurantId }, payload,{returnNewDocument:true}, function (err, updateRestaurant) {
        if (err) return callback(err,null);;
        return callback(null,updateRestaurant);;
    });
}

exports.handle_request = handle_request;