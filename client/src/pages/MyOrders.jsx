import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/user/${userId}/items`
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, [userId]);

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

  if (!userId) {
    return <p style={{ textAlign: "center", color: "red" }}>Please log in to view your orders.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md p-6 mb-8 border">
            <h3 className="font-semibold mb-1">Tracking ID: {order.tracking_id}</h3>
            <p>Total: ₹{order.total_amount}</p>
            <p>Delivery Address: {order.delivery_address}</p>
            <p>
              Estimated Delivery: {new Date(order.estimated_delivery).toDateString()}
            </p>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Items:</h4>
              {!order.items || order.items.length === 0 ? (
                <p className="text-gray-500">No items in this order.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border p-3 rounded-lg bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {order.isReturnEligible && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => openModal(order, "Return")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Return
                </button>
                <button
                  onClick={() => openModal(order, "Exchange")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Exchange
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
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

export default MyOrders;
