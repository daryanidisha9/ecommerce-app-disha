import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { trackingId } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-green-300 p-8">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md w-full">
        <h2 className="text-3xl font-bold text-green-700 mb-4">🎉 Order Placed!</h2>
        <p className="text-lg font-medium">Thank you for your purchase.</p>
        <p className="mt-4 text-gray-700">
          Your <span className="font-semibold">Tracking ID</span> is:
        </p>
        <p className="text-blue-700 font-mono text-xl mt-2">{trackingId}</p>

        <div className="mt-6 flex flex-col gap-3">
          <Link to="/order-history" className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition">
            View Order History
          </Link>
          <Link to={`/track-order?tid=${trackingId}`} className="text-green-700 underline hover:text-green-800">
            Track this Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
