import express from 'express';
import {
  addToStore,
  getNotShownProducts,
} from '../controllers/productControlles.js';
import presenterAuth from '../middlewares/presenterMiddleware.js';
import { deleteReview } from '../controllers/EmployeeControllers.js';

const presenterRoute = express.Router();

presenterRoute.get('/not-shown', getNotShownProducts);
presenterRoute.post('/add-to-store', presenterAuth, addToStore);

//delete unfavorite Reviews
presenterRoute.delete('/delete-review', presenterAuth, deleteReview);
export default presenterRoute;
