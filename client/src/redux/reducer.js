import { combineReducers } from '@reduxjs/toolkit';
import EmployeeSlice from './EmployeeSlice.js';
import CustomerSlice from './CustomerSlice.js';
import CartSlice from './CartSlice.js';
import MatrialSlice from './MatrialCard.js';
import productSlice from './ProductCard.jsx';import Notification from './NotificationSlice.js';
const rootReducer = combineReducers({
  customer: CustomerSlice,
  cart: CartSlice,
  employee: EmployeeSlice,
  matrialCard:MatrialSlice,
  products:productSlice,
  notification: Notification,
});

export { rootReducer };
