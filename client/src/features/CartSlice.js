// src/features/CartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQty: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.cartItems.push({ ...item, qty: 1 });
      }
      updateTotals(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
      updateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (item) {
        item.qty = qty;
        updateTotals(state);
      }
    },
  },
});

const updateTotals = (state) => {
  state.totalQty = state.cartItems.reduce((sum, item) => sum + item.qty, 0);
  state.totalAmount = state.cartItems.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );
};

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
