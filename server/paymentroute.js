const express = require("express");
const router = express.Router();
const paymentController = require("./paymentcontroller");
router.post("/", paymentController.makePayment); // NOT "/pay"


module.exports = router;
