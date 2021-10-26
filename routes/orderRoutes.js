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

module.exports = router;
