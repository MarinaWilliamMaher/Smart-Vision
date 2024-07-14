import express from 'express';
import {
  employeeLogin,
  employeeRegister,
  login,
  register,
} from '../controllers/authControllers.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
//employee
router.post('/employee-register', employeeRegister);
router.post('/employee-login', employeeLogin);
export default router;
