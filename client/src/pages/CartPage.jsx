// src/pages/CartPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../features/CartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQty = useSelector((state) => state.cart.totalQty);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, newQty) => {
    dispatch(updateQuantity({ id, qty: parseInt(newQty) }));
  };

  const handleCheckout = () => {
    navigate("/checkout"); // ✅ Go to CheckoutPage
  };

  if (cartItems.length === 0) {
    return <div className="p-6 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover border rounded"
              />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <label className="block mb-1">
                  Qty:
                  <select
                    className="ml-2 border px-2 py-1"
                    value={item.qty}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                </label>
                <p>Price: ₹{item.price}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <p className="text-lg font-semibold">Total Quantity: {totalQty}</p>
        <p className="text-xl font-bold">Total Amount: ₹{totalAmount}</p>

        {/* ✅ Proceed to Checkout Button */}
        <button
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
