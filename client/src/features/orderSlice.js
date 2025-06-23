import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, postRequest, putRequest } from "../api/api";

// 📦 Place Order (trackingId is passed from frontend!)
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (order, thunkAPI) => {
    try {
      const response = await postRequest("/api/orders", order);

      return {
        orderId: response.orderId,
        trackingId: response.trackingId,
        estimatedDelivery: response.estimatedDelivery,
        deliveryAddress: order.deliveryAddress,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Order failed");
    }
  }
);

// 📦 Fetch Orders for a user
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId, thunkAPI) => {
    try {
      const response = await getRequest(`/api/orders/user/${userId}`);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔄 Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const response = await putRequest("/api/orders/status", { orderId, status });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    lastOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.lastOrder = payload;
        state.list.push(payload); // Add to order list
      })
      .addCase(placeOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload;
      })
      .addCase(fetchOrders.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        const existingOrder = state.list.find((o) => o.id === payload.id);
        if (existingOrder) {
          existingOrder.status = payload.status;
        }
      });
  },
});

export const { clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
