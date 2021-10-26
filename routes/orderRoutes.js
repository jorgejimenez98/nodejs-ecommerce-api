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

  // Calculate Total Price of Order
  const totalPrices = await Promise.all(
    // Map All order Items from Order
    orderItemsIdsResolved.map(async (orderItemId) => {
      // Get Order Item Model
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        ["price"]
      );
      // Get total price from OrderItem
      const totalPrice = orderItem.product.price * orderItem.quantity;
      // Return Total Price
      return totalPrice;
    })
  );

  // Sum All total Prices from Array
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

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
    totalPrice: totalPrice,
    user: data.user,
  });

  // Save New Order
  order = await order.save();
  // Return new Order
  if (!order) res.status(404).send("Error to create order");
  res.send(order);
});

// GET ORDERS DETAILS
router.get(`/:orderId`, async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId)
    .populate("user", ["name", "email"])
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order) res.status(500).json({ success: false });
  res.send(order);
});

// UPDATE ORDER
router.put("/:id", async (req, res) => {
  const data = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: data.status },
    { new: true } // Return new values
  );
  if (!order) res.status(404).send("Order not Updated");
  res.status(200).send(order);
});

// DELETE ORDER
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Order.findByIdAndRemove(id)
    .then(async (deletedOrder) => {
      if (deletedOrder) {
        await deletedOrder.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "Order Deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Order not Found" });
      }
    })
    .catch((error) => {
      return res.status(404).json({ success: false, error: error });
    });
});

// GET TOTAL SALES
router.get("/get/totalSales", async (req, res) => {
  // Calculate all Total Pirces from Database
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);

  // Return all total Prices
  if (!totalSales) res.status(400).send("Order Sales not generated");
  res.status(200).send({ totalSales: totalSales.pop().totalSales });
});

// GET PRODUCTS COUNT
router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments({});
  if (!orderCount) res.status(500).json({ success: false });
  res.status(200).send({ productsCount: orderCount });
});

// GET USER AUTH LIST OF ORDERS
router.get(`/get/userOrders/:userId`, async (req, res) => {
  const userId = req.params.userId;
  const userOrderList = await Order.find({ user: userId })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort("-dateOrdered");
  if (!userOrderList) res.status(500).json({ success: false });
  res.send(userOrderList);
});

module.exports = router;
