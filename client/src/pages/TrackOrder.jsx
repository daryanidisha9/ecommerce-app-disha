import React, { useState } from "react";

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [error, setError] = useState("");

  const fetchTrackingTimeline = async () => {
    if (!trackingId.trim()) {
      alert("Please enter a tracking ID.");
      return;
    }

    try {
      // Fetch order by tracking ID
      const orderRes = await fetch(
        `http://localhost:5000/api/orders/track/${trackingId.trim()}`
      );

      if (!orderRes.ok) {
        throw new Error("Order not found");
      }

      const order = await orderRes.json();
      setOrderInfo(order);

      // Fetch tracking timeline
      const timelineRes = await fetch(
        `http://localhost:5000/api/orders/track-order?tid=${trackingId.trim()}`
      );

      const data = await timelineRes.json();

      // Handle possible formats
      setTrackingData(Array.isArray(data.timeline) ? data.timeline : []);

      // Include estimated delivery if present
      if (data.estimated_delivery) {
        setOrderInfo((prev) => ({
          ...prev,
          estimated_delivery: data.estimated_delivery,
        }));
      }

      setError("");
    } catch (err) {
      console.error("Tracking fetch error:", err);
      setError("Tracking error. Please check the ID or payment status.");
      setOrderInfo(null);
      setTrackingData([]);
    }
  };

  const handleReturn = async () => {
    if (!orderInfo?.id) return;

    try {
      await fetch("http://localhost:5000/api/orders/return-or-exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderInfo.id, type: "Return" }),
      });
      alert("Return requested.");
    } catch (err) {
      console.error("Return request failed:", err);
      alert("Failed to request return.");
    }
  };

  const handleExchange = async () => {
    if (!orderInfo?.id) return;

    try {
      await fetch("http://localhost:5000/api/orders/return-or-exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderInfo.id, type: "Exchange" }),
      });
      alert("Exchange requested.");
    } catch (err) {
      console.error("Exchange request failed:", err);
      alert("Failed to request exchange.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Track Your Order</h1>

      <div className="flex gap-2 mb-4 justify-center">
        <input
          className="border rounded px-3 py-2 w-full max-w-sm"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID"
        />
        <button
          onClick={fetchTrackingTimeline}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Track
        </button>
      </div>

      {orderInfo && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p><strong>Tracking ID:</strong> {orderInfo.tracking_id}</p>

          {orderInfo.estimated_delivery && (
            <p>
              <strong>Estimated Delivery:</strong>{" "}
              {new Date(orderInfo.estimated_delivery).toLocaleDateString()}
            </p>
          )}

          {orderInfo.status && (
            <p><strong>Status:</strong> {orderInfo.status}</p>
          )}

          <h3 className="text-lg font-bold mt-4 mb-2">Order Timeline:</h3>
          {trackingData.length > 0 ? (
            trackingData.map((item, i) => (
              <div
                key={i}
                className="border-l-4 border-blue-500 pl-4 py-2 mb-2 bg-blue-50 rounded-md"
              >
                <p className="font-medium">➡️ {item.status}</p>
                <p className="text-sm text-gray-600">
                  {new Date(item.updated_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No tracking updates available.</p>
          )}

          {orderInfo.status === "Delivered" && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleReturn}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Return
              </button>
              <button
                onClick={handleExchange}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Exchange
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </div>
  );
};

export default TrackOrder;
