const express = require('express');
const router = express.Router();
const productcontroller = require('./productcontroller');

// ✅ Get all products with filters, pagination, and search
router.get('/', productcontroller.getAllProducts);

// ✅ Get single product by ID
router.get('/:id', productcontroller.getProductById);

module.exports = router;
