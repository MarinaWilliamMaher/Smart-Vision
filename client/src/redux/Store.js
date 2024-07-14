import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer.js';

const store = configureStore({
  reducer: rootReducer,
});
const { dispatch } = store;
export { store, dispatch };
