import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: JSON.parse(window?.localStorage.getItem("product")) || [],
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCartP(state, action) {
      state.product = action.payload;
      localStorage.setItem("product", JSON.stringify(action.payload));
    },
    clearCartP(state) {
      state.product = [];
      localStorage?.removeItem("product");
    },
    addToCartP(state, action) {
      const newItem = action.payload;
      const isAlreadyInCart = state.product.some((item) => item._id === newItem._id);

      if (!isAlreadyInCart) {
        state.product.push(newItem);
        localStorage.setItem("product", JSON.stringify(state.product));
      }
    },
    removeFromCartP(state, action) {
        const itemId = action.payload;
        const updatedCart = state.product.filter((item) => item._id !== itemId);
        state.product = updatedCart;
        localStorage.setItem("product", JSON.stringify(updatedCart));
      },
      removeAllFromCartP(state) {
        state.product = [];
        localStorage.removeItem("product");
      },
  },
});

export const { setCartP, clearCartP, addToCartP,removeFromCartP ,removeAllFromCartP} = ProductSlice.actions;
export default ProductSlice.reducer;
