import express from 'express';
import {
  getAllTransactions,
  getMaterialOrders,
  getOrders,
  sendOrderToShipped,
} from '../controllers/InventoryManager.js';
import inventoryManagerAuth from '../middlewares/inventoryManagerMiddleware.js';

const router = express.Router();

router.get('/transaction', inventoryManagerAuth, getAllTransactions);
router.get('/materials', inventoryManagerAuth, getMaterialOrders);
router.get('/products', inventoryManagerAuth, getOrders); // get pending order to inventory manager
router.put('/shipped/:orderId', inventoryManagerAuth, sendOrderToShipped);
export default router;
