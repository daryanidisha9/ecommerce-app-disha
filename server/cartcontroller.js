const db = require('./db');

// ➕ Add to cart
exports.addToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: 'user_id, product_id, and quantity are required' });
  }

  const checkSql = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';

  db.query(checkSql, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || err });

    if (result.length > 0) {
      const updateSql = 'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
      db.query(updateSql, [quantity, user_id, product_id], (err) => {
        if (err) return res.status(500).json({ error: err.message || err });
        res.json({ message: 'Cart updated' });
      });
    } else {
      const insertSql = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
      db.query(insertSql, [user_id, product_id, quantity], (err) => {
        if (err) return res.status(500).json({ error: err.message || err });
        res.json({ message: 'Item added to cart' });
      });
    }
  });
};

// ✅ Get cart items for a user
exports.getCartItems = (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
    SELECT ci.product_id AS id, p.name, p.price, p.image_url AS image, ci.quantity AS qty
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
