

import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: JSON.parse(localStorage.getItem("items")) || [],
    totalAmount: 0,
  },

  reducers: {
    addTocart: (state, action) => {
      console.log(action.payload);

      const product = action.payload;

      const item = state.items.find(
        (item) => item.id == product.id
      );

      if (item) {
        if (item.quantity >= product.stock) {
          toast.error("Cannot add to cart: quantity");
          return;
        }

        item.quantity += 1;
      } else {
        if (product.stock <= 0) {
          toast.error("This product is out of stock");
          return;
        }

        state.items.push({
          ...product,
          quantity: 1,
        });

        toast.success("Product added to cart");
      }

      localStorage.setItem(
        "items",
        JSON.stringify(state.items)
      );

      cartSlice.caseReducers.calcTotalAmount(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id != action.payload
      );

      localStorage.setItem(
        "items",
        JSON.stringify(state.items)
      );

      cartSlice.caseReducers.calcTotalAmount(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;

      localStorage.removeItem("items");
    },

    calcTotalAmount: (state) => {
      state.totalAmount = state.items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      );
    },

    increasreQauntity: (state, action) => {
      const item = state.items.find(
        (item) => item.id == action.payload
      );

      if (item) {
        if (item.quantity < item.stock) {
          item.quantity += 1;

          localStorage.setItem(
            "items",
            JSON.stringify(state.items)
          );
        } else {
          toast.error("Cannot add to cart: quantity");
        }
      }

      cartSlice.caseReducers.calcTotalAmount(state);
    },

    decreasreQauntity: (state, action) => {
      const item = state.items.find(
        (item) => item.id == action.payload
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;

          localStorage.setItem(
            "items",
            JSON.stringify(state.items)
          );
        }
      }

      cartSlice.caseReducers.calcTotalAmount(state);
    },
  },
});

export const {
  addTocart,
  removeFromCart,
  clearCart,
  calcTotalAmount,
  increasreQauntity,
  decreasreQauntity,
} = cartSlice.actions;

export default cartSlice.reducer;
