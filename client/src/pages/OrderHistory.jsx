import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.id) {
      console.error("User not logged in or missing ID.");
      return;
    }

    const userId = user.id;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/user/${userId}/items`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const openModal = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders/return-or-exchange", {
        orderId: selectedOrder.id,
        type: actionType,
      });
      alert(`${actionType} request submitted`);
      setShowModal(false);
    } catch (err) {
      console.error("Request failed:", err);
      alert("Failed to submit request");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <p><strong>Tracking ID:</strong> {order.tracking_id}</p>
            <p><strong>Total:</strong> ₹{order.total_amount}</p>
            <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
            <p><strong>Estimated Delivery:</strong> {new Date(order.estimated_delivery).toDateString()}</p>

            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-lg">Items:</h4>
              {order.items?.length === 0 ? (
                <p>No items in this order.</p>
              ) : (
                order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-3 border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {order.isReturnEligible && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => openModal(order, "Return")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Request Return
                </button>
                <button
                  onClick={() => openModal(order, "Exchange")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  Request Exchange
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Confirm {actionType}?</h2>
            <p>
              Are you sure you want to request a <strong>{actionType}</strong>{" "}
              for order <strong>{selectedOrder.tracking_id}</strong>?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Yes, Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
