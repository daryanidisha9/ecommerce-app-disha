const express = require("express");
const router = express.Router();
const orderController = require("./ordercontroller");

// 1️⃣ Place a new order (initial, unpaid)
router.post("/", orderController.placeOrder);

// 2️⃣ Get all orders by user ID (basic)
router.get("/user/:userId", orderController.getOrdersByUser);

// 3️⃣ Get order timeline by order ID (internal usage)
router.get("/timeline/:orderId", orderController.getOrderTimeline);

// 4️⃣ Update order tracking status (admin usage)
router.post("/status", orderController.updateTrackingStatus);

// 5️⃣ Get order by tracking ID (used after payment success page)
// 🔒 Only returns if is_paid = true
router.get("/track/:trackingId", orderController.getOrderByTrackingId);

// 6️⃣ Get tracking timeline by tracking ID (also requires is_paid = true)
router.get("/track-order", orderController.getTrackingTimelineByTrackingId);

// 7️⃣ Request Return or Exchange (only if status is 'Delivered')
router.post("/return-or-exchange", orderController.requestReturnOrExchange);

// 8️⃣ Get orders with items and return eligibility (for Order History page)
router.get("/user/:userId/items", orderController.getOrdersWithItems);

module.exports = router;
