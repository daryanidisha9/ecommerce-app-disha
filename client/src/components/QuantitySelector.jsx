// src/components/QuantitySelector.jsx
import React from "react";

const QuantitySelector = ({ qty, setQty }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setQty(Math.max(1, qty - 1))}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        -
      </button>
      <span>{qty}</span>
      <button
        onClick={() => setQty(qty + 1)}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
