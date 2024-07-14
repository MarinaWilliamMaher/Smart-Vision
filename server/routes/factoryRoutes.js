import express from 'express';
import {
  getCustomizationOrdersDetails,
  updateServiceOrderStateToShipped,
} from '../controllers/FactoryControllers.js';
import factoryAuth from '../middlewares/factoryMiddleware.js';

const router = express.Router();
//get Customization Order Details to Factory
router.get('/', factoryAuth, getCustomizationOrdersDetails);

router.put('/', factoryAuth, updateServiceOrderStateToShipped);
export default router;
