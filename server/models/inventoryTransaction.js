import mongoose, { Schema } from 'mongoose';
const inventoryTransactionSchema = new mongoose.Schema(
  {
    inventoryManager: {
      type: Schema.Types.ObjectId,
      ref: 'Employees',
    },
    transaction: {
      type: String,
    },
    category: { type: String },
    materials: [
      {
        materialName: { type: String },
        materialARName: { type: String },
        quantity: { type: Number },
      },
    ],
    products: [
      {
        productName: { type: String },
        productARName: { type: String },
        quantity: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const IventoryTransactions = mongoose.model(
  'IventoryTransactions',
  inventoryTransactionSchema
);
export default IventoryTransactions;
