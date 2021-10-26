const express = require("express");
const Order = require("../models/order");
const OrderItem = require("../models/order-item");
const router = express.Router();

// GET LIST OF ORDERS
router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", ["name", "email"])
    .sort("dateOrdered");
  if (!orderList) res.status(500).json({ success: false });
  res.send(orderList);
});

// ADD ORDERS
router.post("/", async (req, res) => {
  const data = req.body;
  // Create Order Items and Get Promise
  const orderItemsIds = Promise.all(
    data.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      // Return newOrderItem ID
      return newOrderItem._id;
    })
  );
  // Await orderItems Id from Promise
  const orderItemsIdsResolved = await orderItemsIds;

  // Create Order
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: data.shippingAddress1,
    shippingAddress2: data.shippingAddress2,
    city: data.city,
    zip: data.zip,
    country: data.country,
    phone: data.phone,
    status: data.status,
    totalPrice: data.totalPrice,
    user: data.user,
  });

  // Save New Order
  order = await order.save();
  // Return new Order
  if (!order) res.status(404).send("Error to create order");
  res.send(order);
});
module.exports = router;
