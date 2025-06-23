// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/CartSlice";
import orderReducer from "../features/orderSlice"; // ✅ Import the order slice

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: orderReducer, // ✅ Add it here
  },
});

export default store;
