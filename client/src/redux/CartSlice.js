import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    cart: JSON.parse(window?.localStorage.getItem('cart')) ?? [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action) {
            console.log(action.payload);
            state.cart = action.payload;
            localStorage.setItem('cart', JSON.stringify(action.payload));
        },
        clearCart(state) {
            state.cart = [];
            localStorage?.removeItem('cart');
        },
    },
});
export default cartSlice.reducer;

export function setCart(cart) {
    return (dispatch, getState) => {
        dispatch(cartSlice.actions.setCart(cart));
    };
}
export function clearCart() {
    return (dispatch, getState) => {
        dispatch(cartSlice.actions.clearCart());
    };
}