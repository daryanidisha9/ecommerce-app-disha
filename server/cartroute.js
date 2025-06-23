const express = require('express');
const router = express.Router();

// 🛠️ Correctly import both functions
const { addToCart, getCartItems } = require('./cartcontroller');

// ➕ Add item to cart
router.post('/add', addToCart);

// 🛒 Get cart items for a user
router.get('/:user_id', getCartItems);

module.exports = router;

