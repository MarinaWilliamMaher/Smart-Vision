import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  customer: JSON.parse(window?.localStorage.getItem('customer')) ?? {},
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer(state, action) {
      console.log(action.payload);
      state.customer = action.payload;
      localStorage.setItem('customer', JSON.stringify(action.payload));
    },
    logout(state) {
      state.customer = null;
      localStorage?.removeItem('token');
      localStorage?.removeItem('customer');
    },
  },
});
export default customerSlice.reducer;

export function SetCustomer(customer) {
  return (dispatch, getState) => {
    dispatch(customerSlice.actions.setCustomer(customer));
  };
}
export function Logout() {
  return (dispatch, getState) => {
    dispatch(customerSlice.actions.logout());
  };
}
