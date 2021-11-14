const Customers = require("../../model/Customers");

async function handle_request(req, callback){
    console.log('req', req);
    const customerId = req.params.id;
    const customer = await Customers.findOne({CustomerId:customerId});
    callback(null,customer);
}

exports.handle_request = handle_request;
