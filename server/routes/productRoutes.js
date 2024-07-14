import express from 'express';
import {
  addProduct,
  addToStore,
  deleteProduct,
  getAllProducts,
  getNotShownProducts,
  getProductById,
  getProductsByCategory,
  getShowProducts,
  productsTransaction,
  updateProduct,
  updateProductDetails,
} from '../controllers/productControlles.js';
import AbilityToChangeProductDetails from '../middlewares/ProductMiddleware.js';
import inventoryManagerAuth from '../middlewares/inventoryManagerMiddleware.js';
const router = express.Router();

//to help inventory manager
router.put('/updateDetails/:id', inventoryManagerAuth, updateProductDetails);
router.put('/transaction', productsTransaction);

// CRUD Product -- RESTFULL API
router.get('/', getShowProducts);
router.post('/', inventoryManagerAuth, addProduct);
router.get('/all', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', AbilityToChangeProductDetails, updateProduct);
router.delete('/', AbilityToChangeProductDetails, deleteProduct);
router.get('/category/:category', getProductsByCategory);

export default router;
