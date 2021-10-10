const router = require("express").Router();
const dbPool = require("../connections/DBConnection");
const { v4: uuidv4 } = require("uuid");
const { stat } = require("fs");
const groupBy = require("lodash.groupby");

router.post("/orders/customer/:id", function (req, resp) {
  let orderId = uuidv4();
  let customerId = req.params.id;
  let cart = req.body.cart;
  let addressId = req.body.addressId;

  let restaurants = [[...new Set(cart.map((item) => item.RestaurantId))]];

  const query =
    "select RestaurantId, Mode from Restaurant where RestaurantId in (?)";
  console.log(query);
  dbPool.query(query, restaurants, async (err, results, fields) => {
    if (err) {
      console.log(err);
      resp.status(500).send({ error: "Unknown internal server error" });
    } else {
      let orderDetails = [];
      let orders = [];
      let restaurantOrderMap = [];
      console.log(restaurants);
      results.map((restaurant) => {
        orderId = uuidv4();
        currentTimeStamp = new Date();
        console.log(
          JSON.stringify([
            orderId,
            customerId,
            restaurant.RestaurantId,
            "New",
            restaurant.Mode,
            currentTimeStamp,
            currentTimeStamp,
            addressId,
          ])
        );
        orders.push([
          orderId,
          customerId,
          restaurant.RestaurantId,
          "New",
          restaurant.Mode,
          currentTimeStamp,
          currentTimeStamp,
          addressId,
        ]);
        restaurantOrderMap[restaurant.RestaurantId] = orderId;
      });
      const orderQuery =
        "INSERT INTO Orders (OrderId, CustomerId, RestaurantId, OrderStatus, DeliveryType, CreatedAt, LastUpdatedTime, AddressId) VALUES ?";
      dbPool.query(orderQuery, [orders], (err, results, fields) => {
        if (err) {
          console.log(err);
          resp.status(500).send({ error: "Unknown internal server error" });
        }
      });
      cart.map((item) => {
        orderDetails.push([
          restaurantOrderMap[item.RestaurantId],
          item.DishId,
          item.Quantity.item.Price,
        ]);
      });
      console.log(JSON.stringify([orderDetails]));
      const detailsQuery =
        "INSERT INTO OrderDetails (OrderId, DishId, Quantity) VALUES ?";
      dbPool.query(detailsQuery, [orderDetails], (err, results, fields) => {
        if (err) {
          console.log(err);
          resp.status(500).send({ error: "Unknown internal server error" });
        }
      });
      resp.send({ order: orders, details: orderDetails });
    }
  });
});

router.get("/orders/customer/:id", function (req, res) {
  const customerId = '36511964-74d7-48b0-b963-eb017b1108af' //harccoding fofr a  while: req.params.id;
  const query =
    "SELECT o.OrderId, o.OrderStatus, d.DishId, d.DishName, od.Price, od.Quantity, r.RestaurantId, r.RestaurantName, a.AddressId, CONCAT(a.AddressLine1,',', a.AddressLine2, ',', a.City, ',', a.State, ',', a.Country, ',', a.PinCode) as DeliveryAddress  FROM Orders as o INNER JOIN OrderDetails as od on o.OrderId = od.OrderId INNER JOIN Dishes as d on d.DishId = od.DishId INNER JOIN Restaurant as r on r.RestaurantID = o.RestaurantId INNER JOIN Address as a on a.AddressId = o.AddressId where o.CustomerId = ?;";
  dbPool.query(query, [customerId], (err, results, fields) => {
    const orderItems = groupBy(results, "OrderId");
    Object.keys(orderItems).forEach((orderId) => {
      orderItems[orderId] = orderItems[orderId].map((item) =>
        JSON.parse(JSON.stringify(item))
      );
    });
    const response = Object.keys(orderItems).map((orderId) => ({
      OrderId: orderId,
      OrderStatus: orderItems[orderId][0].OrderStatus,
      RestaurantId: orderItems[orderId][0].RestaurantId,
      RestaurantName: orderItems[orderId][0].RestaurantName,
      AddressId: orderItems[orderId][0].AddressId,
      DeliveryAddress: orderItems[orderId][0].DeliveryAddress,
      items: orderItems[orderId],
    }));       
    res.status(200).send(response);
  });
});

router.get("/orders/restaurant/:id", function (req, res) {
  
  const restaurantId = 'ae25fd4f-9714-49bf-b8b5-8cf2be9b9921' // hardcoding for a while : req.params.id;
  const query =
    "SELECT o.OrderId, o.OrderStatus, d.DishId, d.DishName, od.Price, od.Quantity, r.RestaurantId, r.RestaurantName, a.AddressId, CONCAT(a.AddressLine1,',', a.AddressLine2, ',', a.City, ',', a.State, ',', a.Country, ',', a.PinCode) as DeliveryAddress  FROM Orders as o INNER JOIN OrderDetails as od on o.OrderId = od.OrderId INNER JOIN Dishes as d on d.DishId = od.DishId INNER JOIN Restaurant as r on r.RestaurantID = o.RestaurantId INNER JOIN Address as a on a.AddressId = o.AddressId where o.RestaurantId = ?;";
  dbPool.query(query, [restaurantId], (err, results, fields) => {
    const orderItems = groupBy(results, "OrderId");
    console.info(results);
    Object.keys(orderItems).forEach((orderId) => {
      orderItems[orderId] = orderItems[orderId].map((item) =>
        JSON.parse(JSON.stringify(item))
      );
    });
    const response = Object.keys(orderItems).map((orderId) => ({
      OrderId: orderId,
      OrderStatus: orderItems[orderId][0].OrderStatus,
      RestaurantId: orderItems[orderId][0].RestaurantId,
      RestaurantName: orderItems[orderId][0].RestaurantName,
      AddressId: orderItems[orderId][0].AddressId,
      DeliveryAddress: orderItems[orderId][0].DeliveryAddress,
      items: orderItems[orderId],
    }));
    res.status(200).send(response);
  });
});

router.post("/orders/restaurant/:id", function (req, res) {
  const restaurantId = req.params.id;
  const { OrderId, OrderStatus } = req.body;
  const query =
    "UPDATE Orders SET OrderStatus = ? WHERE OrderId = ? AND RestaurantId = ?";
  dbPool.query(
    query,
    [OrderStatus, restaurantId, OrderId],
    (err, results, fields) => {
      res.status(200).send({ message: "updated successfully" });
    }
  );
});

module.exports = router;
