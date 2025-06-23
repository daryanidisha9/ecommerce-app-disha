// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get order data passed via navigate state
  const { orderId, totalAmount, trackingId, address, estimatedDelivery } = location.state || {};

  const [paymentMode, setPaymentMode] = useState("UPI");

  useEffect(() => {
    if (!trackingId || !totalAmount) {
      alert("Missing payment details. Redirecting...");
      navigate("/checkout");
    }
  }, [trackingId, totalAmount, navigate]);

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/payment", {
        trackingId,
        paymentMethod: paymentMode,
        amount: totalAmount,
      });

      if (response.data.message === "Payment successful!") {
        alert("✅ Payment Successful!");

        // Navigate to payment success page
        navigate("/payment-success", {
          state: {
            orderId,
            trackingId,
            address,
            estimatedDelivery,
          },
        });
      } else {
        alert("⚠️ Payment failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Payment Error:", err);
      alert("❌ Payment failed. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Make Payment</h2>

        <div className="mb-4">
          <label className="block mb-1">Select Payment Mode:</label>
          <select
            className="border w-full p-2 rounded"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold">Total Amount: ₹{totalAmount}</p>
        </div>

        <button
          onClick={handlePayment}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
