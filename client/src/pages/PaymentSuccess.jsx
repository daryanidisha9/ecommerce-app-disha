import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, trackingId, address, estimatedDelivery } = location.state || {};

  if (!orderId) {
    return (
      <div className="p-8 text-center text-red-600">
        Invalid access. Please place an order first.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h2>
        <p className="mb-2 text-lg">🎉 Your order has been placed successfully.</p>
        <p className="mb-1"><strong>Order ID:</strong> #{orderId}</p>
        <p className="mb-1"><strong>Tracking ID:</strong> {trackingId}</p>
        <p className="mb-1"><strong>Delivery Address:</strong> {address}</p>
        <p className="mb-4"><strong>Estimated Delivery:</strong> {estimatedDelivery?.slice(0, 10)}</p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/track-order")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Track Order
          </button>

          <button
            onClick={() => navigate("/order-history")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            View Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
