import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SearchResults from "./pages/SearchResults";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage";
import ProductDetails from "./pages/ProductDetails";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import TrackOrder from "./pages/TrackOrder";
import OrderHistory from "./pages/OrderHistory";
import OrderSuccess from "./pages/OrderSuccess";
import Logout from "./pages/Logout";
import MyOrders from "./pages/MyOrders";


import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/order-history" element={<OrderHistory />} /> // ✅ Fix here
        <Route path="/order-success/:trackingId" element={<OrderSuccess />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/my-orders" element={<MyOrders />} />


        </Routes>
    </>
  );
};

export default App;
