import express from 'express';
import presenterRoute from './presenterRoutes.js';
import actorRoute from './actorRoutes.js';
import engineerRoute from './engineerRoute.js';
import inventoryManagerRoute from './inventoryManagerRoute.js';
import factoryRoute from './factoryRoutes.js';
import operatorRoute from './operatorRoutes.js';

const router = express.Router();

/* //#region Customer
//get Customers
router.get('/getCustomers', getAllCustomers);
//get Customer
router.get('/getCustomer/:customerId', getCustomerById);
//delete Customer
router.delete('/deleteCustomer', deleteCustomer);
router.post('/customer', addCustomer);
router.put('/customer', manageCustomers);

//#endregion */

router.use(`/presenter`, presenterRoute);

router.use('/actor', actorRoute);

router.use('/engineer', engineerRoute);

router.use('/inventory', inventoryManagerRoute);

router.use('/factory', factoryRoute);

router.use('/operator', operatorRoute);

export default router;
