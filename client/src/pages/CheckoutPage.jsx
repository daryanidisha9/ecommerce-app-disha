// CheckoutPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { placeOrder } from "../features/orderSlice";
import { useNavigate } from "react-router-dom";

const formatToMySQLDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const user = JSON.parse(localStorage.getItem("user"));

  const handlePlaceOrder = async () => {
    if (!user || !user.id) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    if (!address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    const trackingId = "TRK" + Math.floor(Math.random() * 1000000);
    const date = formatToMySQLDateTime(new Date().toISOString());
    const estimatedDelivery = formatToMySQLDateTime(
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    );

    const fullOrder = {
      items: cartItems.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.qty || item.quantity,
        price: item.price,
      })),
      totalAmount,
      deliveryAddress: address,
      paymentMethod,
      date,
      estimatedDelivery,
      userId: user.id,
      trackingId,
    };

    try {
      // Place order and payment is handled in backend
      const res = await dispatch(placeOrder(fullOrder)).unwrap();
      const orderId = res.orderId;

      alert("✅ Payment successful! Your order is placed.");

      navigate("/payment-success", {
        state: {
          orderId,
          trackingId,
          address,
          estimatedDelivery,
        },
      });
    } catch (error) {
      console.error("❌ Order error:", error);
      alert("Failed to place order or process payment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-200 p-6 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-4 text-center">Checkout</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Delivery Address</label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-full"
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Payment Method</label>
          <select
            className="border rounded px-4 py-2 w-full"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="UPI">UPI</option>
            <option value="GPay">GPay</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <ul className="space-y-2">
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {item.title || item.name} x {item.qty || item.quantity}
                </span>
                <span>₹{item.price * (item.qty || item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-right text-lg font-bold mb-4">
          Total: ₹{totalAmount}
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Place Order & Pay
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
