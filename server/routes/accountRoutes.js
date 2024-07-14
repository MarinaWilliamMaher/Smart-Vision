import express from 'express';
import {
  addAccountTransaction,
  getAccountTransactionById,
  getAllAccountTransactions,
  updateAccountTransaction,
} from '../controllers/AccountManagerControllers.js';

const router = express.Router();

router.post('/', addAccountTransaction);
router.get('/', getAllAccountTransactions); // you can send wanted method in body
router.put('/', updateAccountTransaction);
router.get('/:transactionId', getAccountTransactionById);

export default router;
