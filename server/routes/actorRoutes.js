import express from 'express';
import {
  addEmployee,
  changePassword,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  manageEmployees,
} from '../controllers/EmployeeControllers.js';
import actorManagerAuth from '../middlewares/actorManagerMiddleware.js';

const router = express.Router();

router.post('/', actorManagerAuth, addEmployee);
router.get('/', actorManagerAuth, getAllEmployees);
router.get('/:id', actorManagerAuth, getEmployeeById);
router.put('/', actorManagerAuth, manageEmployees);
router.delete('/', actorManagerAuth, deleteEmployee);
router.put('/change_password', actorManagerAuth, changePassword);

export default router;
