import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(window?.localStorage.getItem("card")) || [],
};

const MatrialSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setCart(state, action) {
      state.cart = action.payload;
      localStorage.setItem("card", JSON.stringify(action.payload));
    },
    clearCart(state) {
      state.cart = [];
      localStorage?.removeItem("card");
    },
    addToCart(state, action) {
      const newItem = action.payload;
      const isAlreadyInCart = state.cart.some((item) => item._id === newItem._id);

      if (!isAlreadyInCart) {
        state.cart.push(newItem);
        localStorage.setItem("card", JSON.stringify(state.cart));
      }
    },
    removeFromCart(state, action) {
        const itemId = action.payload;
        const updatedCart = state.cart.filter((item) => item._id !== itemId);
        state.cart = updatedCart;
        localStorage.setItem("card", JSON.stringify(updatedCart));
      },
      removeAllFromCart(state) {
        state.cart = [];
        localStorage.removeItem("card");
      },
  },
});

export const { setCart, clearCart, addToCart,removeFromCart ,removeAllFromCart} = MatrialSlice.actions;
export default MatrialSlice.reducer;
