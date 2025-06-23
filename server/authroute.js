const express = require('express');
const { register, login } = require('./authcontroller');

const router = express.Router();

router.post('/register', register); // ✅ /api/auth/register
router.post('/login', login);       // ✅ /api/auth/login

module.exports = router;
