import express from 'express';
import {
  deleteContactUs,
  getAllOrders,
  getAllServices,
  getContactUs,
  getOrderById,
  sentProductOrderToInventory,
  updateOrderStatus,
  updateServiceOrderStatus,
} from '../controllers/OperatorController.js';
import operatorAuth from '../middlewares/operatorMiddleware.js';
import { getServiceById } from '../controllers/EmployeeControllers.js';
import getServicePermission from '../middlewares/getServiceMiddleware.js';

const router = express.Router();

router.get('/orders', operatorAuth, getAllOrders);
router.get('/orders/:orderId', operatorAuth, getOrderById);
router.put('/orders', operatorAuth, updateOrderStatus);
router.put('/orders/:orderId', operatorAuth, sentProductOrderToInventory);

router.get('/services', operatorAuth, getAllServices);
router.get('/services/:serviceId', getServicePermission, getServiceById);
router.put('/services', operatorAuth, updateServiceOrderStatus); // to get services order to operator

router.get('/contactUs', getContactUs);
router.delete('/contactUs/:contactUsId', deleteContactUs);

export default router;
