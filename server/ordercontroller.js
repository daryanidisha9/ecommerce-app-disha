const db = require("./db");

function formatDateTime(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

const VALID_STATUSES = [
  "Ordered",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Returned",
  "Cancelled"
];

// 1. Place Order with Payment
exports.placeOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      deliveryAddress,
      trackingId,
      date,
      paymentMethod = "UPI"
    } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const created_at = formatDateTime(new Date(date || Date.now()));
    const estimated_delivery = formatDateTime(
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    );
    const orderStatus = "Ordered";

    // Insert order
    const [result] = await db.query(
      `INSERT INTO orders (user_id, total_amount, delivery_address, tracking_id, status, created_at, estimated_delivery, is_paid)
       VALUES (?, ?, ?, ?, ?, ?, ?, false)`,
      [userId, totalAmount, deliveryAddress, trackingId, orderStatus, created_at, estimated_delivery]
    );
    const orderId = result.insertId;

    // Insert items
    for (let item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    // Tracking status
    await db.query(
      `INSERT INTO order_tracking (order_id, status, updated_at)
       VALUES (?, ?, ?)`,
      [orderId, orderStatus, created_at]
    );

    // Insert payment
    await db.query(
      `INSERT INTO payments (tracking_id, payment_method, amount, payment_status)
       VALUES (?, ?, ?, ?)`,
      [trackingId, paymentMethod, totalAmount, "Paid"]
    );

    // Mark order as paid
    await db.query(
      `UPDATE orders SET is_paid = 1 WHERE id = ?`,
      [orderId]
    );

    res.json({
      message: "Order placed and payment recorded.",
      orderId,
      trackingId,
      totalAmount,
      estimatedDelivery: estimated_delivery
    });

  } catch (error) {
    console.error("\u274C Error placing order:", error);
    res.status(500).json({ error: "Error placing order" });
  }
};

// 2. Get Orders by User (Flattened + Product Info)
exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    const result = await Promise.all(orders.map(async (order) => {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      return {
        ...order,
        items: items.map(item => ({
          productId: item.product_id,
          name: item.name,
          image_url: item.image_url,
          quantity: item.quantity,
          price: item.price
        }))
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// 3. Get Timeline by Order ID
exports.getOrderTimeline = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [results] = await db.query(
      "SELECT * FROM order_tracking WHERE order_id = ? ORDER BY updated_at ASC",
      [orderId]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
};

// 4. Update Tracking Status
exports.updateTrackingStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    await db.query(
      `INSERT INTO order_tracking (order_id, status, updated_at) VALUES (?, ?, NOW())`,
      [orderId, status]
    );

    await db.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );

    res.json({ message: "Tracking status updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update tracking" });
  }
};

// 5. Get Order by Tracking ID (only if paid)
exports.getOrderByTrackingId = async (req, res) => {
  const { trackingId } = req.params;
  try {
    const [results] = await db.query(
      "SELECT * FROM orders WHERE tracking_id = ? AND is_paid = 1",
      [trackingId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Tracking ID not found or not paid" });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// 6. Get Timeline by Tracking ID (if paid)
exports.getTrackingTimelineByTrackingId = async (req, res) => {
  const { tid } = req.query;

  try {
    const [orders] = await db.query(
      `SELECT id, is_paid, estimated_delivery, status FROM orders WHERE tracking_id = ?`,
      [tid]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Invalid tracking ID" });
    }

    const order = orders[0];
    if (!order.is_paid) {
      return res.status(403).json({ error: "Order not paid yet" });
    }

    const [timeline] = await db.query(
      `SELECT * FROM order_tracking WHERE order_id = ? ORDER BY updated_at ASC`,
      [order.id]
    );

    res.json({
      timeline,
      estimated_delivery: order.estimated_delivery,
      status: order.status
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tracking timeline" });
  }
};

// 7. Request Return or Exchange
exports.requestReturnOrExchange = async (req, res) => {
  const { orderId, type } = req.body;

  if (!["Return", "Exchange"].includes(type)) {
    return res.status(400).json({ error: "Invalid request type" });
  }

  try {
    await db.query(
      `INSERT INTO order_tracking (order_id, status, updated_at) VALUES (?, ?, NOW())`,
      [orderId, type]
    );

    await db.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [type, orderId]
    );

    res.json({ message: `${type} request submitted` });
  } catch (err) {
    res.status(500).json({ error: "Failed to process request" });
  }
};

// 8. Get Orders with Items and Return Eligibility
exports.getOrdersWithItems = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.query(
          `SELECT oi.*, p.name as product_name, p.price, p.image_url
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`,
          [order.id]
        );

        const now = new Date();
        const deliveryDate = new Date(order.estimated_delivery);
        const returnDeadline = new Date(deliveryDate);
        returnDeadline.setDate(returnDeadline.getDate() + 5);

        const itemsFormatted = items.map(item => ({
          id: item.product_id,
          name: item.product_name,
          image: item.image_url,
          quantity: item.quantity,
          price: item.price
        }));

        return {
          ...order,
          items: itemsFormatted,
          isReturnEligible: order.status === "Delivered" && now <= returnDeadline,
        };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
