import mongoose, { Schema } from 'mongoose';
const AccountTransactionSchema = new mongoose.Schema(
  {
    date: { type: String },
    method: { type: String },
    description: { type: String },
    amount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const AccountTransactions = mongoose.model(
  'AccountTransactions',
  AccountTransactionSchema
);
export default AccountTransactions;
