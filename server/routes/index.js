import express from "express";
import authRoute from "./authRoutes.js";
import customerRoute from "./customerRoutes.js";
import productRoute from "./productRoutes.js";
import employeeRoute from "./employeeRoutes.js";
import materialRoute from "./materialRoutes.js";
import accountRoute from "./accountRoutes.js";
const router = express.Router();

router.use(`/api/auth`, authRoute); // EX: auth/register
router.use(`/api/customers`, customerRoute); // EX: customers/...
router.use(`/api/products`, productRoute); // EX: products/...
router.use(`/api/employees`, employeeRoute); // EX: employees/...
router.use(`/api/materials`, materialRoute); // EX: materials/...
router.use(`/api/accounts`, accountRoute); // EX: accounts/...

export default router;
