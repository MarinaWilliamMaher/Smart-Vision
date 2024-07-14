import express from 'express';
import {
  addMaterial,
  deleteMaterial,
  getMaterials,
  materialsTransaction,
  updateMaterial,
  getMaterialById,
} from '../controllers/MaterialControllers.js';
import { changeStateToShipped } from '../controllers/InventoryManager.js';
import inventoryManagerAuth from '../middlewares/inventoryManagerMiddleware.js';

const router = express.Router();
router.post('/', inventoryManagerAuth, addMaterial);
router.get('/', inventoryManagerAuth, getMaterials);
router.delete('/', inventoryManagerAuth, deleteMaterial);
router.put('/transaction', inventoryManagerAuth, materialsTransaction);
router.put('/', inventoryManagerAuth, updateMaterial);
router.get('/:id', inventoryManagerAuth, getMaterialById);
router.put('/changetoshipped', inventoryManagerAuth, changeStateToShipped);
export default router;
