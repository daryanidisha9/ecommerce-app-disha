const db = require("./db");

exports.makePayment = async (req, res) => {
  try {
    const { trackingId, paymentMethod, amount } = req.body;

    console.log("💰 Payment payload received:", { trackingId, paymentMethod, amount });

    if (!trackingId || !paymentMethod || !amount) {
      return res.status(400).json({ error: "Missing payment data" });
    }

    // Insert into payments table
    await db.query(
      `INSERT INTO payments (tracking_id, payment_method, amount, payment_status)
       VALUES (?, ?, ?, ?)`,
      [trackingId, paymentMethod, amount, "Paid"]
    );

    // Retry logic to update is_paid (max 5 retries)
    let updated = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      const [result] = await db.query(
        `UPDATE orders SET is_paid = 1 WHERE tracking_id = ?`,
        [trackingId]
      );

      if (result.affectedRows > 0) {
        console.log(`✅ is_paid updated on attempt ${attempt}`);
        updated = true;
        break;
      }

      console.warn(`⏳ Retry ${attempt}: Order with tracking_id ${trackingId} not found yet`);
      await new Promise((resolve) => setTimeout(resolve, 400)); // Wait 400ms
    }

    if (!updated) {
      console.error("❌ No order found to update is_paid after retries!");
      return res.status(404).json({ error: "Order not found to update is_paid" });
    }

    res.status(200).json({ message: "Payment successful!" });
  } catch (err) {
    console.error("❌ Payment error:", err);
    res.status(500).json({ error: "Payment failed on server" });
  }
};
