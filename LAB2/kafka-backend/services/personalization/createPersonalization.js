const mongoose = require("mongoose");
const Customers = require("../../model/Customers");

async function handle_request(req, callback) {
  try {
    const CustomerId = mongoose.Types.ObjectId(req.body.CustomerId);
    const RestaurantId = mongoose.Types.ObjectId(req.body.RestaurantId);
    let customer = await Customers.findOne({ CustomerId: CustomerId });
    if (!customer) {
      return res.status(400).send("Customer not found");
    } else {
      customer.Favourites.push(RestaurantId);
      updatedCustomer = await customer.save();
      callback(null, updatedCustomer);
    }
  } catch (error) {
    callback(error, null);
  }
}

exports.handle_request = handle_request;
