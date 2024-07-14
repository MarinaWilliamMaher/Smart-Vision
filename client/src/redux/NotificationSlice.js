import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  notification: JSON.parse(window?.localStorage.getItem('notification')) ?? [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      console.log(action.payload);
      state.notification = action.payload;
      localStorage.setItem('notification', JSON.stringify(action.payload));
    },
    clearNotification(state) {
      state.notification = [];
      localStorage?.removeItem('notification');
    },
  },
});
export default notificationSlice.reducer;

export function setNotification(notification) {
  return (dispatch, getState) => {
    dispatch(notificationSlice.actions.setNotification(notification));
  };
}
export function clearNotification() {
  return (dispatch, getState) => {
    dispatch(notificationSlice.actions.clearNotification());
  };
}
