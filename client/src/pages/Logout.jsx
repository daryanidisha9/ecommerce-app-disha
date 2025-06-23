// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data
    localStorage.removeItem("user");
    
    // You can also clear cart or other states here if needed
    // localStorage.removeItem("cart");

    // Redirect after short delay
    setTimeout(() => {
      navigate("/login");
    }, 1000); // Optional delay
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-700">Logging you out...</h2>
      </div>
    </div>
  );
};

export default Logout;
