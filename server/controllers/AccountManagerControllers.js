import AccountTransactions from '../models/AccountTransactions.js';

const calculateBalance = async () => {
  let totalBalance = 0;
  const transactions = await AccountTransactions.find({});
  await Promise.all(
    transactions.map(async (tran) => {
      if (tran.method === 'Export') {
        totalBalance -= tran.amount;
      } else {
        totalBalance += tran.amount;
      }
    })
  );
  return totalBalance;
};

export const addAccountTransaction = async (req, res, next) => {
  try {
    const { date, method, description, amount } = req.body;
    if (!date || !method || !description || !amount) {
      next('Provide Required Fields!');
      return;
    }
    const transaction = await AccountTransactions.create({
      date,
      method,
      description,
      amount,
    });
    const totalBalance = await calculateBalance();
    res.status(200).json({
      success: true,
      message: 'record this transactions successfully',
      transaction: transaction,
      totalBalance: totalBalance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllAccountTransactions = async (req, res, next) => {
  try {
    const { method } = req?.body;
    let transaction;
    if (method) {
      transaction = await AccountTransactions.find({ method });
    } else {
      transaction = await AccountTransactions.find({});
    }
    const totalBalance = await calculateBalance();
    res.status(200).json({
      success: true,
      message: 'get all transactions successfully',
      transaction: transaction,
      totalBalance: totalBalance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAccountTransactionById = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const transaction = await AccountTransactions.findById({
      _id: transactionId,
    });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction is not found',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'get account transaction successfully',
        transaction: transaction,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateAccountTransaction = async (req, res, next) => {
  try {
    const transactionData = req.body;
    const transaction = await AccountTransactions.findById({
      _id: transactionData.transactionId,
    });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction is not found',
      });
    } else {
      const updatedTransaction = await AccountTransactions.findByIdAndUpdate(
        { _id: transactionData.transactionId },
        { ...transactionData },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: 'update account transaction successfully',
        updatedTransaction: updatedTransaction,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'wrong Id' });
  }
};
